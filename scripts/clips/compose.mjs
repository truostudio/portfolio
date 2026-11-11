#!/usr/bin/env node
// Pass 2 of a clip: turns the recorded frames (record.mjs) into public/<name>.mp4,
// Screen Studio style: the window on a backdrop, a camera that eases in, out
// and along, a cursor that glides, and motion blur on whatever moves fast.
//
//   node scripts/clips/compose.mjs <name> [--out file.mp4] [--shot 2.5,7] [--crf 20]
//
// --shot writes stills (seconds in) beside the frames, shot-<s>.png instead.
import { chromium } from "playwright";
import { readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { geometry, makeCamera } from "./camera.mjs";

const HERE = import.meta.dirname;
const argv = process.argv.slice(2);
const opt = (k, dflt) => { const i = argv.indexOf(`--${k}`); return i < 0 ? dflt : argv[i + 1]; };
const name = argv[0];
const DIR = path.join(process.env.CLIPS_DIR || path.join(process.env.LOCALAPPDATA || process.env.TMPDIR || "/tmp", "portfolio-clips"), name);
const tl = JSON.parse(readFileSync(path.join(DIR, "timeline.json"), "utf8"));
const O = tl.opts || {};
const W = O.w ?? 1760, H = O.h ?? 1080, FPS = tl.fps;
const SHOT = opt("shot", null), CRF = opt("crf", String(O.crf ?? 20));
const OUTF = path.resolve(opt("out", path.resolve(HERE, "..", "..", "public", `${O.file ?? name}.mp4`)));
const SHUTTER = O.shutter ?? 0.55;     // of a frame's time
const FFMPEG = process.env.FFMPEG || "ffmpeg";

const WALLS = {
  // warm daylight: peach, lilac, sage
  hoppy: { base: "#efe3d6", blobs: [[0.08, 0.1, 0.55, "rgba(255,196,160,.95)"], [0.95, 0.05, 0.6, "rgba(206,190,255,.9)"], [0.85, 0.95, 0.6, "rgba(186,226,196,.9)"], [0.1, 0.95, 0.5, "rgba(255,224,170,.85)"], [0.5, 0.5, 0.45, "rgba(255,240,230,.5)"]], grain: 5 },
  // Hopscotch: cool slate with a lime glow
  hopscotch: { base: "#d9ddd6", blobs: [[0.05, 0.08, 0.6, "rgba(214,240,120,.75)"], [0.98, 0.1, 0.55, "rgba(170,196,214,.9)"], [0.9, 0.95, 0.6, "rgba(120,150,140,.75)"], [0.08, 0.98, 0.5, "rgba(236,232,214,.9)"]], grain: 5 },
  // the portfolio's existing clips: teal and blush
  classic: { base: "#7fb9b6", blobs: [[0.2, 0.0, 0.6, "rgba(242,196,206,.95)"], [0.85, 0.05, 0.55, "rgba(236,208,220,.9)"], [0.05, 0.9, 0.55, "rgba(40,150,140,.9)"], [0.9, 0.95, 0.6, "rgba(60,130,160,.9)"]], grain: 5 },
};

const geo = geometry(tl, W, H, O);
const cam = makeCamera(tl, geo, O);
const N = O.length ? Math.min(cam.n, Math.round(O.length * FPS)) : cam.n;
const stageGeo = {
  ...geo, radius: O.radius ?? 14, shadow: O.shadow ?? 0.3, edge: O.edge ?? "rgba(0,0,0,.10)",
  cursorScale: O.cursorScale ?? 1.5, wall: typeof O.wall === "object" ? O.wall : WALLS[O.wall ?? "classic"],
};

// across a cut, the frame before it fades out over the new ones (smootherstep)
const cutAt = k => {
  for (const c of tl.cuts || []) {
    const i = k - (c.k + 1);
    if (i >= 0 && i < c.n) { const u = (i + 1) / (c.n + 1); return { k: c.k, a: 1 - u * u * u * (u * (u * 6 - 15) + 10) }; }
  }
  return null;
};

// the camera samples for an output frame: more of them the further things move
function samplesAt(t, k) {
  const at = tt => {
    const v = cam.view(tt), c = cam.cur(tt);
    const fade = O.cursorOut != null && tt > O.cursorOut ? Math.max(0, 1 - (tt - O.cursorOut) / 0.4) : O.cursorIn != null ? Math.min(1, Math.max(0, (tt - O.cursorIn) / 0.4)) : 1;
    return { cx: v.cx, cy: v.cy, z: v.z, x: c.x, y: c.y, press: cam.press(tt), cursor: O.hideCursor ? null : cam.cursorType(tt), alpha: fade };
  };
  const half = (SHUTTER / FPS) / 2;
  const a = at(t - half), b = at(t + half);
  const scr = (s, x, y) => [(x - s.cx) * s.z + W / 2, (y - s.cy) * s.z + H / 2];
  let move = 0;
  for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H], [W / 2, H / 2]]) {
    const p = scr(a, x, y), q = scr(b, x, y);
    move = Math.max(move, Math.hypot(p[0] - q[0], p[1] - q[1]));
  }
  const pc = scr(a, a.x, a.y), qc = scr(b, b.x, b.y);
  move = Math.max(move, Math.hypot(pc[0] - qc[0], pc[1] - qc[1]));
  const S = Math.max(1, Math.min(48, Math.ceil(move / 1.0)));
  if (S === 1) return [at(t)];
  return Array.from({ length: S }, (_, i) => at(t - half + (2 * half * i) / (S - 1)));
}

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.route("http://clip.local/**", async route => {
  const u = new URL(route.request().url());
  if (u.pathname === "/") return route.fulfill({ body: readFileSync(path.join(HERE, "stage.html")), contentType: "text/html" });
  if (u.pathname.startsWith("/frames/") && existsSync(path.join(DIR, "frames", path.basename(u.pathname)))) return route.fulfill({ body: readFileSync(path.join(DIR, "frames", path.basename(u.pathname))), contentType: "image/png" });
  return route.fulfill({ status: 404 });
});
page.on("pageerror", e => console.error("stage error:", e.message));
await page.goto("http://clip.local/");
await page.evaluate(g => window.setup(g), stageGeo);
const cdp = await page.context().newCDPSession(page);
const grab = async () => Buffer.from((await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true })).data, "base64");

if (SHOT) {
  for (const s of SHOT.split(",").map(Number)) {
    const k = Math.min(N - 1, Math.round(s * FPS));
    await page.evaluate(([k, ss, c]) => window.draw(k, ss, c), [k, samplesAt(k / FPS, k), cutAt(k)]);
    const f = path.join(DIR, `shot-${s}.png`);
    writeFileSync(f, await grab());
    console.log(f);
  }
  await browser.close();
  process.exit(0);
}

const enc = spawn(FFMPEG, [
  "-hide_banner", "-loglevel", "error", "-y",
  "-f", "image2pipe", "-framerate", `${FPS}`, "-c:v", "png", "-i", "-",
  "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
  "-c:v", "libx264", "-preset", "slow", "-crf", CRF, "-g", "120",
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
  "-movflags", "+faststart", "-an", OUTF,
], { stdio: ["pipe", "inherit", "inherit"] });
const ended = new Promise((ok, no) => enc.on("close", c => (c === 0 ? ok() : no(new Error(`ffmpeg exited with ${c}`)))));
const write = buf => new Promise(r => (enc.stdin.write(buf) ? r() : enc.stdin.once("drain", r)));
const t0 = Date.now();
let blurred = 0;
for (let k = 0; k < N; k++) {
  const ss = samplesAt(k / FPS, k);
  if (ss.length > 1) blurred++;
  await page.evaluate(([k, ss, c]) => window.draw(k, ss, c), [k, ss, cutAt(k)]);
  await write(await grab());
  if (k % 60 === 0) process.stdout.write(`compose ${name}: ${(k / FPS).toFixed(0)} of ${(N / FPS).toFixed(0)} s\r`);
}
enc.stdin.end();
await ended;
await browser.close();
console.log(`\ncompose ${name}: ${OUTF}  ${Math.round(statSync(OUTF).size / 1024)} KB, ${(N / FPS).toFixed(1)} s, ${blurred} frames blurred, ${Math.round((Date.now() - t0) / 1000)} s`);

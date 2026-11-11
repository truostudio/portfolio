#!/usr/bin/env node
// Pass 1 of a clip: drives a live page on a virtual clock (vclock.js) and
// captures every frame at 60 fps and 2x, with the cursor's path and the camera
// directions in a timeline beside them. compose.mjs turns that into the clip.
//
//   node scripts/clips/record.mjs <shot name>
//
// Shots live in scripts/clips/shots/<name>.mjs. Frames go to %LOCALAPPDATA%/portfolio-clips/<name>/ (or CLIPS_DIR).
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HERE = import.meta.dirname;
const argv = process.argv.slice(2);
const name = argv[0];
if (!name) { console.error("record: name a shot"); process.exit(1); }
const shot = (await import(pathToFileURL(path.join(HERE, "shots", `${name}.mjs`)).href)).default;
const FPS = 60, DT = 1000 / FPS;
const VW = shot.viewport?.w ?? 1440, VH = shot.viewport?.h ?? 822, DPR = shot.dpr ?? 2;
// frames are big: keep them out of the repo and OneDrive
const OUT = path.join(process.env.CLIPS_DIR || path.join(process.env.LOCALAPPDATA || process.env.TMPDIR || "/tmp", "portfolio-clips"), name);
rmSync(path.join(OUT, "frames"), { recursive: true, force: true });
mkdirSync(path.join(OUT, "frames"), { recursive: true });

const browser = await chromium.launch({
  headless: true, executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--font-render-hinting=none"],
});
const context = await browser.newContext({
  viewport: { width: VW, height: VH }, deviceScaleFactor: DPR,
  reducedMotion: "no-preference", colorScheme: shot.scheme ?? "light",
});
if (shot.storage) await context.addInitScript(shot.storage);
// page scripts that run before the app (a shot's own tweaks for the recording)
if (shot.init) await context.addInitScript(shot.init);
await context.addInitScript({ path: path.join(HERE, "vclock.js") });
if (shot.css) await context.addInitScript(`(() => { const add = () => { const s = document.createElement("style"); s.dataset.clip = ""; s.textContent = ${JSON.stringify(shot.css)}; document.head.appendChild(s); }; document.head ? add() : document.addEventListener("DOMContentLoaded", add); })();`);
const page = await context.newPage();
page.on("pageerror", e => console.error("page error:", e.message));
const cdp = await context.newCDPSession(page);

await page.goto(shot.url, { waitUntil: "load" });
await page.waitForTimeout(shot.settle ?? 2500);
if (shot.setup) await shot.setup(page);
await page.waitForTimeout(400);
await page.evaluate(() => window.__vclock.manual());

// ---------- the director ----------
const frames = [];
const directives = [];
const cuts = [];
let mouse = { x: shot.cursorStart?.x ?? VW * 0.62, y: shot.cursorStart?.y ?? VH * 0.7 }, down = false;
const pending = new Set();
let k = 0;
await page.mouse.move(mouse.x, mouse.y);

const ease = u => u * u * u * (u * (u * 6 - 15) + 10); // smootherstep
// a seeded random, so a re-record comes out the same
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const FORBID = shot.forbid ? shot.forbid.source : null;
// how much page time each video frame covers: above 1 is a time-lapse of the
// page (its own streaming, timers, animations) while the cursor and camera keep pace
let SPEED = 1;
async function frame() {
  const { cursor, leak } = await page.evaluate(([x, y, forbid, speed]) => window.__vclock.step((1000 / 60) * speed).then(() => {
    let leak = null;
    if (forbid) {
      const re = new RegExp(forbid, "i");
      const vals = [...document.querySelectorAll("input, textarea, select")].map(e => e.value).join(" ");
      const attrs = [...document.querySelectorAll("[title], [aria-label], [placeholder]")].map(e => `${e.getAttribute("title") || ""} ${e.getAttribute("aria-label") || ""} ${e.getAttribute("placeholder") || ""}`).join(" ");
      const all = `${document.title} ${location.href} ${document.body.innerText} ${vals} ${attrs}`;
      const m = all.match(re);
      if (m) leak = m[0];
    }
    let el = document.elementFromPoint(x, y), c = "default";
    while (el && el.shadowRoot && el.shadowRoot.elementFromPoint) { const inner = el.shadowRoot.elementFromPoint(x, y); if (!inner || inner === el) break; el = inner; }
    if (el) {
      c = getComputedStyle(el).cursor;
      if (c === "auto") {
        const tag = el.tagName;
        if (tag === "TEXTAREA" || el.isContentEditable || (tag === "INPUT" && !/^(button|submit|checkbox|radio|range|color|file|reset|image)$/i.test(el.type))) c = "text";
      }
    }
    return { leak, cursor: /pointer/.test(c) ? "hand" : /text/.test(c) ? "text" : "arrow" };
  }), [mouse.x, mouse.y, FORBID, SPEED]);
  if (leak) throw new Error(`forbidden text on screen at frame ${k}: "${leak}"`);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true, fromSurface: true });
  const file = path.join(OUT, "frames", `${String(k).padStart(5, "0")}.png`);
  const buf = Buffer.from(data, "base64");
  const w = writeFile(file, buf);
  pending.add(w); w.then(() => pending.delete(w));
  frames.push({ x: +mouse.x.toFixed(2), y: +mouse.y.toFixed(2), c: cursor, d: down ? 1 : 0 });
  k++;
  if (k % 60 === 0) process.stdout.write(`record ${name}: ${(k / FPS).toFixed(0)} s\r`);
}

async function resolve(target) {
  if (target == null) return { x: mouse.x, y: mouse.y, w: 0, h: 0 };
  if (typeof target === "string") {
    const r = await page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left, y: b.top, w: b.width, h: b.height };
    }, target);
    if (!r) throw new Error(`no element for ${target}`);
    return r;
  }
  if (typeof target === "function") return { w: 0, h: 0, ...(await target(page)) };
  return { w: 0, h: 0, ...target };
}
const centre = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const d = {
  page, VW, VH,
  get t() { return k / FPS; },
  rand,
  async wait(s) { const n = Math.round(s * FPS); for (let i = 0; i < n; i++) await frame(); },
  async rect(target) { return resolve(target); },
  // glide the cursor to a target (a selector, a rect or a point), eased in and out on a soft arc
  async move(target, dur = 0.8, { dx = 0, dy = 0, arc = 0.08, at = null } = {}) {
    const r = await resolve(target);
    const c = at ? { x: r.x + r.w * at[0], y: r.y + r.h * at[1] } : centre(r);
    const to = { x: c.x + dx, y: c.y + dy }, from = { ...mouse };
    const n = Math.max(1, Math.round(dur * FPS));
    const vx = to.x - from.x, vy = to.y - from.y, len = Math.hypot(vx, vy) || 1;
    const nx = -vy / len, ny = vx / len, bend = arc * len * (rand() < 0.5 ? -1 : 1);
    for (let i = 1; i <= n; i++) {
      const u = ease(i / n), s = Math.sin(Math.PI * u);
      mouse = { x: from.x + vx * u + nx * bend * s, y: from.y + vy * u + ny * bend * s };
      await page.mouse.move(mouse.x, mouse.y);
      await frame();
    }
  },
  async click({ hold = 0.09, after = 0.1 } = {}) {
    down = true; await page.mouse.down();
    await d.wait(hold);
    await page.mouse.up(); down = false;
    await d.wait(after);
  },
  async moveClick(target, dur = 0.8, opts = {}) { await d.move(target, dur, opts); await d.wait(opts.pause ?? 0.12); await d.click(opts); },
  // type like a person: a little uneven, a touch slower at spaces
  async type(text, { cps = 16 } = {}) {
    for (const ch of text) {
      await page.keyboard.insertText(ch);
      await frame();
      const gap = (1 / cps) * (0.6 + rand() * 0.8) * (ch === " " ? 1.4 : 1);
      await d.wait(Math.max(0, gap - 1 / FPS));
    }
  },
  async press(key) { await page.keyboard.press(key); await frame(); },
  // paste: the whole text lands at once, as a real paste does
  async paste(text) { await page.keyboard.insertText(text); await frame(); },
  // press, glide to a target (eased, as move), let go
  async drag(target, dur = 0.9, opts = {}) {
    down = true; await page.mouse.down();
    await d.wait(opts.hold ?? 0.08);
    await d.move(target, dur, { arc: 0.03, ...opts });
    await d.wait(opts.settle ?? 0.06);
    await page.mouse.up(); down = false;
    await d.wait(0.05);
  },
  // scroll a container (or the page) by dy over dur, eased
  async scroll(target, dy, dur = 1.2) {
    const n = Math.max(1, Math.round(dur * FPS));
    const start = await page.evaluate(sel => { const el = sel ? document.querySelector(sel) : document.scrollingElement; return el.scrollTop; }, target || null);
    for (let i = 1; i <= n; i++) {
      const y = start + dy * ease(i / n);
      await page.evaluate(([sel, y]) => { const el = sel ? document.querySelector(sel) : document.scrollingElement; el.scrollTop = y; }, [target || null, y]);
      await frame();
    }
  },
  async run(fn, arg) { return page.evaluate(fn, arg); },
  // time-lapse the page (1 is real time)
  speed(s = 1) { SPEED = s; },
  // the page itself just jumped (a re-layout): compose dissolves across it
  // (the frame just captured shows the jump: the ghost is the one before it)
  cut(frames = 8) { cuts.push({ k: k - 2, n: frames }); },
  // camera directions, read by compose.mjs
  cam: {
    // zoom onto a target: z is the zoom (1 shows the whole window on its backdrop)
    async focus(target, z = 1.6, dur = 1.1, opts = {}) { const r = await resolve(target); directives.push({ t: k / FPS, kind: "focus", rect: r, z, dur, ...opts }); },
    // zoom to z and follow the cursor
    follow(z = 1.6, dur = 1.1, opts = {}) { directives.push({ t: k / FPS, kind: "follow", z, dur, ...opts }); },
    out(dur = 1.1) { directives.push({ t: k / FPS, kind: "out", dur }); },
  },
};

const t0 = Date.now();
try {
  await shot.run(d);
} finally {
  await Promise.all([...pending]);
  writeFileSync(path.join(OUT, "timeline.json"), JSON.stringify({ name, fps: FPS, vw: VW, vh: VH, dpr: DPR, frames, directives, cuts, opts: shot.compose ?? {} }));
  console.log(`\nrecord ${name}: ${k} frames (${(k / FPS).toFixed(1)} s) in ${Math.round((Date.now() - t0) / 1000)} s`);
  await browser.close();
}

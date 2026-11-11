// The camera and cursor for a clip, worked out from record.mjs's timeline.
// Everything is a function of time, so motion blur can sample between frames.
//
// Stage: the output frame at zoom 1, the app's window centred on a backdrop.
// A view is { cx, cy, z }: the stage point at the centre of the frame, and the zoom.

export const smoother = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * u * (u * (u * 6 - 15) + 10));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function geometry(tl, W, H, opts = {}) {
  const pad = opts.pad ?? Math.round(W * 0.05);
  let ww = W - 2 * pad, wh = (ww * tl.vh) / tl.vw;
  if (wh > H - 2 * pad) { wh = H - 2 * pad; ww = (wh * tl.vw) / tl.vh; }
  const win = { x: (W - ww) / 2, y: (H - wh) / 2, w: ww, h: wh, k: ww / tl.vw };
  return { W, H, win, zFill: Math.max(W / ww, H / wh) };
}

export function makeCamera(tl, geo, opts = {}) {
  const { W, H, win, zFill } = geo;
  const fps = tl.fps, n = tl.frames.length, T = n / fps;
  const toStage = p => ({ x: win.x + p.x * win.k, y: win.y + p.y * win.k });

  // the cursor, in stage px, any time
  const cur = t => {
    const f = clamp(t * fps, 0, n - 1), i = Math.floor(f), j = Math.min(n - 1, i + 1), u = f - i;
    const a = tl.frames[i], b = tl.frames[j];
    return toStage({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u });
  };

  // where the view may go at a zoom: the whole stage at 1, only the window once it fills the frame
  const bounds = z => {
    const s = smoother(clamp((z - 1) / (zFill - 1), 0, 1));
    const st = { x0: 0, y0: 0, x1: W, y1: H }, wn = { x0: win.x, y0: win.y, x1: win.x + win.w, y1: win.y + win.h };
    return { x0: st.x0 + (wn.x0 - st.x0) * s, y0: st.y0 + (wn.y0 - st.y0) * s, x1: st.x1 + (wn.x1 - st.x1) * s, y1: st.y1 + (wn.y1 - st.y1) * s };
  };
  // a card that crops the clip's sides (object-fit: cover) only ever shows the
  // middle cropX of its width: the camera need only keep that part on the window
  const cropX = opts.cropX ?? 1;
  const fit = (cx, cy, z) => {
    const b = bounds(z), hw = (W * cropX) / 2 / z, hh = H / 2 / z;
    const x = b.x1 - b.x0 <= 2 * hw ? (b.x0 + b.x1) / 2 : clamp(cx, b.x0 + hw, b.x1 - hw);
    const y = b.y1 - b.y0 <= 2 * hh ? (b.y0 + b.y1) / 2 : clamp(cy, b.y0 + hh, b.y1 - hh);
    return { cx: x, cy: y, z };
  };

  // a follow track per zoom: the cursor clamped to the bounds, then smoothed twice
  // (two first-order lags in a row: it starts and stops without a kick)
  const tracks = new Map();
  const follow = (z, tau, lead) => {
    const key = `${z}|${tau}|${lead}`;
    if (tracks.has(key)) return tracks.get(key);
    const sub = 10, dt = 1 / (fps * sub), a = 1 - Math.exp(-dt / tau);
    const out = new Float64Array((n * sub + 2) * 2);
    let p0 = fit(cur(0).x, cur(0).y, z), s1 = { x: p0.cx, y: p0.cy }, s2 = { ...s1 };
    for (let i = 0; i < n * sub + 2; i++) {
      const t = i * dt, c = cur(t + lead), f = fit(c.x, c.y, z);
      s1.x += (f.cx - s1.x) * a; s1.y += (f.cy - s1.y) * a;
      s2.x += (s1.x - s2.x) * a; s2.y += (s1.y - s2.y) * a;
      out[i * 2] = s2.x; out[i * 2 + 1] = s2.y;
    }
    const fn = t => {
      const f = clamp(t / dt, 0, n * sub), i = Math.floor(f), u = f - i;
      const x = out[i * 2] + (out[i * 2 + 2] - out[i * 2]) * u, y = out[i * 2 + 1] + (out[i * 2 + 3] - out[i * 2 + 1]) * u;
      return { cx: x, cy: y, z };
    };
    tracks.set(key, fn);
    return fn;
  };

  // segments: each a view (fixed or following) that the camera moves to over dur
  const start = opts.start ? focusView(opts.start) : { cx: W / 2, cy: H / 2, z: 1 };
  function focusView(dv) {
    const r = dv.rect || { x: 0, y: 0, w: 0, h: 0 };
    const c = toStage({ x: r.x + r.w / 2 + (dv.dx ?? 0), y: r.y + r.h / 2 + (dv.dy ?? 0) });
    let z = dv.z ?? 1.6;
    if (dv.fitRect && r.w > 0) z = Math.min(z, (W * 0.86) / (r.w * win.k), (H * 0.82) / (r.h * win.k));
    return fit(c.x, c.y, Math.max(1, z));
  }
  const segs = [{ t: 0, dur: 0, at: () => start }];
  for (const dv of tl.directives) {
    let at;
    if (dv.kind === "focus") { const v = focusView(dv); at = () => v; }
    else if (dv.kind === "follow") at = follow(dv.z, dv.tau ?? 0.32, dv.lead ?? 0.12);
    else { const v = { cx: W / 2, cy: H / 2, z: 1 }; at = () => v; }
    segs.push({ t: dv.t + (dv.delay ?? 0), dur: dv.dur ?? 1.1, at });
  }

  // between two views: a zoom about the one point that stays put on screen, log-scale
  // a long pan pulls back a little on the way, as a camera operator would, so
  // it never whips across at full zoom (none at either end, so moves still
  // start and stop at rest; a short move or a zoom has none)
  const DIP = opts.dip ?? 0.55;
  const lerpView = (A, B, u) => {
    if (u <= 0) return A;
    if (u >= 1) return B;
    const r = B.z / A.z;
    const z = A.z * Math.pow(r, u);
    const far = (Math.hypot(B.cx - A.cx, B.cy - A.cy) * Math.min(A.z, B.z)) / W;
    const dip = Math.min(0.45, Math.max(0, far - 0.35) * DIP) * Math.sin(Math.PI * u);
    let v;
    if (Math.abs(r - 1) < 1e-4) v = { cx: A.cx + (B.cx - A.cx) * u, cy: A.cy + (B.cy - A.cy) * u, z };
    else {
      const fx = (B.cx * B.z - A.cx * A.z) / (B.z - A.z), fy = (B.cy * B.z - A.cy * A.z) / (B.z - A.z);
      v = { cx: fx - ((fx - A.cx) * A.z) / z, cy: fy - ((fy - A.cy) * A.z) / z, z };
    }
    if (dip > 0) v = { ...v, z: Math.max(1, v.z * (1 - dip)) };
    return v;
  };
  const viewUpTo = (i, t) => {
    const s = segs[i];
    if (i === 0) return s.at(t);
    const u = smoother((t - s.t) / Math.max(1e-6, s.dur));
    if (u <= 0) return viewUpTo(i - 1, t);
    const B = s.at(t);
    if (u >= 1) return B;
    return lerpView(viewUpTo(i - 1, t), B, u);
  };
  const view = t => {
    let i = 0;
    while (i + 1 < segs.length && segs[i + 1].t <= t) i++;
    return viewUpTo(i, t);
  };

  // the press: eased toward down or up
  const pressTrack = (() => {
    const out = new Float32Array(n + 1);
    let p = 0;
    for (let i = 0; i <= n; i++) {
      const f = tl.frames[Math.min(n - 1, i)];
      const target = f.d ? 1 : 0, a = target ? 0.45 : 0.22;
      p += (target - p) * a;
      out[i] = p;
    }
    return t => { const f = clamp(t * fps, 0, n), i = Math.floor(f), u = f - i; return out[i] + ((out[Math.min(n, i + 1)] ?? out[i]) - out[i]) * u; };
  })();
  const cursorType = t => tl.frames[clamp(Math.round(t * fps), 0, n - 1)].c;

  return { T, n, view, cur, press: pressTrack, cursorType, toStage };
}

// Injected before any page script. Replaces the page's sense of time with a
// virtual clock, so a recording steps every frame exactly 1/60 s whatever the
// machine does: Date, performance.now, timers, requestAnimationFrame, and every
// CSS animation, transition and Web Animation (paused and seeked to the clock).
//
// It starts in "auto": the clock follows real time, so the page loads and
// settles as normal. __vclock.manual() freezes it; __vclock.step(ms) moves it on.
(() => {
  if (window.__vclock) return;
  const N = {
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    raf: window.requestAnimationFrame.bind(window),
    perfNow: performance.now.bind(performance),
    Date: window.Date,
  };
  const chan = new MessageChannel();
  const tickQ = [];
  chan.port1.onmessage = () => { const f = tickQ.shift(); f && f(); };
  const yieldTask = () => new Promise(r => { tickQ.push(r); chan.port2.postMessage(0); });

  let now = N.perfNow();
  let auto = true;
  const dateOffset = N.Date.now() - now;

  // ---- time ----
  performance.now = () => now;
  class VDate extends N.Date {
    constructor(...a) { if (a.length === 0) super(Math.round(dateOffset + now)); else super(...a); }
    static now() { return Math.round(dateOffset + now); }
  }
  window.Date = VDate;

  // ---- timers ----
  const timers = new Map();
  let seq = 1;
  function add(fn, ms, args, repeat) {
    const id = seq++;
    const d = Math.max(0, Number(ms) || 0);
    timers.set(id, { at: now + d, fn, args, every: repeat ? Math.max(4, d) : 0, id });
    return id;
  }
  window.setTimeout = (fn, ms, ...args) => add(fn, ms, args, false);
  window.setInterval = (fn, ms, ...args) => add(fn, ms, args, true);
  window.clearTimeout = window.clearInterval = id => { timers.delete(id); };

  // ---- frames ----
  let rafs = new Map();
  let rseq = 1;
  window.requestAnimationFrame = fn => { const id = rseq++; rafs.set(id, fn); return id; };
  window.cancelAnimationFrame = id => { rafs.delete(id); };

  function next(limit) {
    let best = null;
    for (const t of timers.values()) if (t.at <= limit && (!best || t.at < best.at || (t.at === best.at && t.id < best.id))) best = t;
    return best;
  }
  async function runTimers(to) {
    let n = 0;
    for (;;) {
      const t = next(to);
      if (!t || ++n > 5000) break;
      if (t.at > now) now = t.at;
      if (t.every) t.at += t.every; else timers.delete(t.id);
      try { typeof t.fn === "function" ? t.fn(...(t.args || [])) : (0, eval)(String(t.fn)); } catch (e) { console.error(e); }
      if (n % 8 === 0) await yieldTask();
      else await Promise.resolve();
    }
  }
  function runFrame() {
    const cbs = rafs; rafs = new Map();
    for (const fn of cbs.values()) { try { fn(now); } catch (e) { console.error(e); } }
  }

  // ---- animations ----
  const own = new WeakMap();
  function syncAnims() {
    let list;
    try { list = document.getAnimations(); } catch { return; }
    for (const a of list) {
      if (a.timeline && a.timeline !== document.timeline) continue;
      const st = a.playState;
      let o = own.get(a);
      if (st === "running" || (st === "paused" && a.pending && !o)) {
        o = { t0: now, ct0: a.currentTime || 0, rate: a.playbackRate || 1 };
        own.set(a, o);
        try { a.pause(); } catch {}
      }
      if (!o || a.playState !== "paused") continue;
      const ct = o.ct0 + (now - o.t0) * o.rate;
      let end = Infinity;
      try { end = a.effect ? a.effect.getComputedTiming().endTime : Infinity; } catch {}
      if ((o.rate > 0 && ct >= end) || (o.rate < 0 && ct <= 0)) {
        own.delete(a);
        try { a.finish(); } catch { try { a.currentTime = o.rate > 0 ? end : 0; } catch {} }
      } else {
        try { a.currentTime = ct; } catch {}
      }
    }
  }

  // ---- auto mode: follow real time ----
  let realBase = N.perfNow(), vBase = now;
  async function autoTick() {
    if (!auto) return;
    const to = vBase + (N.perfNow() - realBase);
    await runTimers(to);
    now = Math.max(now, to);
    runFrame();
    if (auto) N.raf(autoTick);
  }
  N.raf(autoTick);
  // backstop for timers when frames are slow
  (function loop() { if (!auto) return; const to = vBase + (N.perfNow() - realBase); runTimers(to).then(() => { now = Math.max(now, to); }); N.setTimeout(loop, 8); })();

  const twoFrames = () => new Promise(r => N.raf(() => N.raf(r)));
  window.__vclock = {
    get now() { return now; },
    get auto() { return auto; },
    manual() { auto = false; syncAnims(); },
    resume() { auto = true; realBase = N.perfNow(); vBase = now; N.raf(autoTick); },
    // move the clock on by ms, as one frame, then wait for the page to paint it
    async step(ms) {
      const to = now + ms;
      await runTimers(to);
      now = to;
      runFrame();
      for (let i = 0; i < 3; i++) await yieldTask();
      syncAnims();
      await twoFrames();
      syncAnims();
    },
    syncAnims,
  };
})();

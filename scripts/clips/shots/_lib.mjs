// Targets for shots: each is a function of the page that returns a rect in
// viewport px, worked out at the moment it's used.

const toRect = b => ({ x: b.left, y: b.top, w: b.width, h: b.height });

// the first element matching a CSS selector (or the nth)
export const box = (sel, n = 0) => async page => {
  const r = await page.evaluate(([s, n]) => { const e = document.querySelectorAll(s)[n]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; }, [sel, n]);
  if (!r) throw new Error(`no element for ${sel}`);
  return r;
};

// the nth element whose own text is exactly `t`, measured by the control it sits in
export const text = (t, { n = 0, within = "body", raw = false } = {}) => async page => {
  const r = await page.evaluate(([t, n, within, raw]) => {
    const root = document.querySelector(within) || document.body;
    const leaves = [...root.querySelectorAll("*")].filter(e => {
      if (e.closest("[data-clip-hidden]")) return false;
      const own = [...e.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent).join("").trim();
      return (own === t || (e.childElementCount === 0 && e.textContent.trim() === t)) && e.getBoundingClientRect().width > 0;
    });
    const e = leaves[n];
    if (!e) return null;
    const c = raw ? e : e.closest("button, a, label, [role=tab], [role=button], [role=option], input, summary") || e;
    const b = c.getBoundingClientRect();
    return { x: b.left, y: b.top, w: b.width, h: b.height };
  }, [t, n, within, raw]);
  if (!r) throw new Error(`no text "${t}" (#${n})`);
  return r;
};

// the rect around several targets
export const union = (...ts) => async page => {
  const rs = [];
  for (const t of ts) rs.push(await t(page));
  const x = Math.min(...rs.map(r => r.x)), y = Math.min(...rs.map(r => r.y));
  return { x, y, w: Math.max(...rs.map(r => r.x + r.w)) - x, h: Math.max(...rs.map(r => r.y + r.h)) - y };
};

// a point relative to a target: [0..1, 0..1] of its box, plus px
export const at = (t, fx, fy, dx = 0, dy = 0) => async page => { const r = await t(page); return { x: r.x + r.w * fx + dx, y: r.y + r.h * fy + dy, w: 0, h: 0 }; };

// step frames until a check in the page passes (max seconds at most)
export const until = async (d, fn, arg, max = 3) => { for (let n = 0; n < max * 60; n++) { if (await d.page.evaluate(fn, arg)) return true; await d.wait(1 / 60); } console.log("until: gave up after", max, "s"); return false; };

export { toRect };

// the nth (or last, n = -1) control whose text includes `t`
export const contains = (t, { n = 0, sel = "button, a, label, [role=option], [role=tab]", within = "body" } = {}) => async page => {
  const r = await page.evaluate(([t, n, sel, within]) => {
    const all = [...(document.querySelector(within) || document.body).querySelectorAll(sel)].filter(e => e.textContent.includes(t) && e.getBoundingClientRect().width > 0);
    const e = n < 0 ? all[all.length + n] : all[n];
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return { x: b.left, y: b.top, w: b.width, h: b.height };
  }, [t, n, sel, within]);
  if (!r) throw new Error(`nothing contains "${t}" (#${n})`);
  return r;
};

// a page script that swaps text wherever it shows, as the app draws it (for
// mock data that holds something personal): pairs of [from, to]
export const swapText = pairs => `(() => {
  const P = ${JSON.stringify(pairs)};
  const fix = n => { if (n.nodeType === 3) { let t = n.nodeValue, o = t; for (const [a, b] of P) t = t.split(a).join(b); if (t !== o) n.nodeValue = t; } else if (n.nodeType === 1) { for (const c of n.childNodes) fix(c); if (n.value) for (const [a, b] of P) if (n.value.includes(a)) n.value = n.value.split(a).join(b); } };
  new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") fix(m.target); for (const n of m.addedNodes) fix(n); } }).observe(document, { subtree: true, childList: true, characterData: true });
  document.addEventListener("DOMContentLoaded", () => fix(document.body));
})();`;

// the first element matching a selector that is actually on screen
export const vis = sel => async page => {
  const r = await page.evaluate(s => { const e = [...document.querySelectorAll(s)].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== "hidden"; }); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; }, sel);
  if (!r) throw new Error(`nothing visible for ${sel}`);
  return r;
};

// A page script that rewrites visible text as the app draws it: text nodes,
// input and textarea values, and the title, placeholder and aria-label
// attributes. `pairs` are [from, to], exact; `words` are [from, to], matched
// in any case and given the case of what they replace (Uniblock -> Hopscotch).
// It holds as the page changes: a MutationObserver for what's added or edited,
// and a pass over field values each frame, since typing into one isn't a mutation.
// `patterns` are [regex source, to], for text that shouldn't be spelled out here.
export const rewrite = ({ pairs = [], words = [], patterns = [] } = {}) => `(() => {
  const P = ${JSON.stringify(pairs)}, W = ${JSON.stringify(words)}, RX = ${JSON.stringify(patterns)}.map(([a, b]) => [new RegExp(a, "gi"), b]);
  const esc = s => s.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
  const RW = W.map(([a, b]) => [new RegExp(esc(a), "gi"), b]);
  const cased = (m, b) => m === m.toUpperCase() ? b.toUpperCase() : m[0] === m[0].toUpperCase() ? b[0].toUpperCase() + b.slice(1) : b.toLowerCase();
  const swap = t => { if (!t) return t; for (const [a, b] of P) if (t.includes(a)) t = t.split(a).join(b); for (const [re, b] of RW) t = t.replace(re, m => cased(m, b)); for (const [re, b] of RX) t = t.replace(re, b); return t; };
  const ATTRS = ["title", "placeholder", "aria-label", "value"];
  const fixEl = e => {
    for (const a of ATTRS) { const v = e.getAttribute && e.getAttribute(a); if (v) { const w = swap(v); if (w !== v) e.setAttribute(a, w); } }
    if ((e.tagName === "INPUT" || e.tagName === "TEXTAREA") && e.value) { const w = swap(e.value); if (w !== e.value) e.value = w; }
  };
  const fix = n => {
    if (n.nodeType === 3) { const v = n.nodeValue, w = swap(v); if (w !== v) n.nodeValue = w; return; }
    if (n.nodeType !== 1) return;
    fixEl(n);
    const tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
    for (let t = tw.nextNode(); t; t = tw.nextNode()) { const v = t.nodeValue, w = swap(v); if (w !== v) t.nodeValue = w; }
    for (const e of n.querySelectorAll("[title], [placeholder], [aria-label], input, textarea")) fixEl(e);
  };
  new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") fix(m.target); else if (m.type === "attributes") fixEl(m.target); else for (const n of m.addedNodes) fix(n); } })
    .observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  const fields = () => { for (const e of document.querySelectorAll("input, textarea")) fixEl(e); requestAnimationFrame(fields); };
  document.addEventListener("DOMContentLoaded", () => { fix(document.body); document.title = swap(document.title); fields(); });
})();`;

// Hopscotch's dashboard prototype carries its old name, Uniblock, in its mock data
export const HOPSCOTCH_NAMES = rewrite({
  pairs: [["uniblock.dev", "hopscotchlabs.ai"], ["sk-uniblock-", "sk-hop-"], ["ak-uniblock-", "ak-hop-"]],
  words: [["uniblock", "hopscotch"]],
});

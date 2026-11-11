// Hoppy: a Hoppy on the floor asks to start a helper; you say yes, and Juno joins.
const at = sel => async page => {
  const r = await page.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; }, sel);
  if (!r) throw new Error(`no ${sel}`);
  return r;
};
// a plain bit of floor: no storey below it, no desk, nothing that lights up
const REST = { x: 820, y: 600 };

export default {
  url: "http://localhost:5317/demo",
  settle: 5000,
  css: ".vpick,.states{display:none!important}",
  dpr: 2.5,
  cursorStart: REST,
  async setup(page) {
    for (let i = 0; i < 2; i++) { await page.click('[data-gzoom="in"]'); await page.waitForTimeout(700); }
    await page.mouse.move(REST.x, REST.y);
    await page.waitForTimeout(1200);
  },
  compose: { wall: "hoppy", file: "hoppy-floor" },
  async run(d) {
    const mochi = at('[data-open="cards:mochi"]');
    await d.wait(0.5);
    // frame Mochi and the space its card opens into, so the card needs no second move
    await d.cam.focus(mochi, 1.6, 1.15, { dx: 230, dy: 70 });
    await d.move(mochi, 0.95, { dy: 2 });
    await d.wait(0.15);
    await d.click({ after: 0.05 });
    await d.wait(0.95);
    await d.move(at('.insp [data-ianswer="cards:0:0"]'), 0.6);
    await d.wait(0.1);
    await d.click({ after: 0.05 });
    // step off the card, so its reflow puts no tooltip under the cursor
    await d.move(async page => { const r = await at(".insp")(page); return { x: r.x + r.w + 14, y: r.y + r.h * 0.62 }; }, 0.5, { arc: 0.04 });
    // the camera stays on the card while Mochi's reply lands and Juno joins
    // (each job keeps its seat, so nothing on the floor moves when it does)
    let n = 0;
    while (!(await d.run(() => !!document.querySelector('[data-open$=":juno"]'))) && n++ < 300) await d.wait(1 / 60);
    await d.wait(0.8);
    await d.press("Escape");
    const juno = at('[data-open$=":juno"]');
    await d.cam.focus(juno, 2.1, 1.1, { dy: 6 });
    await d.move(juno, 0.85, { dy: 4 });
    await d.wait(1.0);
    d.cam.out(1.1);
    await d.move(REST, 1.0);
    await d.wait(0.6);
  },
};

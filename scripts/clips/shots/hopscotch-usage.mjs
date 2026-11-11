// Hopscotch: one dashboard for every model a team calls. Spend, speed and
// failures across every request, at a glance.
import { box, text, union, at, HOPSCOTCH_NAMES } from "./_lib.mjs";

const MAIN = "main .scroll-thin";
export default {
  url: "http://localhost:5173/#/usage",
  settle: 3000,
  // the review switcher (View as) is review chrome, not the product
  css: ".fixed.cursor-grab.touch-none{display:none!important}",
  // the prototype's mock data still says Uniblock, its old name
  init: HOPSCOTCH_NAMES,
  forbid: /uniblock/,
  cursorStart: { x: 1010, y: 690 },
  compose: { wall: "hopscotch", file: "hopscotch-usage" },
  async run(d) {
    await d.wait(0.35);
    // the numbers, then a different range
    await d.cam.focus(union(text("$747.29", { raw: true }), text("Cache hit rate", { raw: true }), text("This month", { n: 1 })), 1.7, 1.05, { fitRect: true, dy: 20 });
    await d.move(text("7d", { within: "main" }), 0.9);
    await d.wait(0.1);
    await d.click({ after: 0.7 });
    // by day: sweep the bars, then the same chart in spend
    await d.cam.focus(union(text("By day", { raw: true }), at(text("By day", { raw: true }), 0, 0, 760, 230)), 1.75, 1.05, { dx: 40 });
    await d.move(at(text("By day", { raw: true }), 0, 0, 200, 150), 0.8);
    await d.move(at(text("By day", { raw: true }), 0, 0, 520, 120), 1.0, { arc: 0.02 });
    await d.move(text("Spend", { n: 1, within: "main" }), 0.6);
    await d.click({ after: 0.65 });
    // where it went, by provider and then by model
    await d.scroll(MAIN, 1080, 1.3);
    await d.cam.focus(text("Where it went", { raw: true }), 1.6, 1.3, { dx: 250, dy: 170, delay: -1.3 });
    await d.move(text("Model", { within: "main" }), 0.7);
    await d.click({ after: 0.4 });
    await d.move(at(text("Where it went", { raw: true }), 0, 0, 330, 120), 0.7);
    await d.wait(0.7);
    d.cam.out(1.1);
    await d.move({ x: 1010, y: 690 }, 0.9);
    await d.wait(0.6);
  },
};

// Hopscotch: a playground for trying a prompt on up to three models side by
// side. The fastest way to pick a model is to watch them answer the same question.
// (The answers are the prototype's own mock replies, which are about Hopscotch,
// so the question is too.)
import { box, text, union, at, contains, until, HOPSCOTCH_NAMES } from "./_lib.mjs";

const PROMPT = 'textarea[placeholder="One prompt, three models"]';
export default {
  url: "http://localhost:5173/#/playground",
  settle: 3000,
  css: ".fixed.cursor-grab.touch-none{display:none!important}",
  // the prototype's mock data still says Uniblock, its old name
  init: HOPSCOTCH_NAMES,
  forbid: /uniblock/,
  cursorStart: { x: 1010, y: 690 },
  compose: { wall: "hopscotch", file: "hopscotch-playground" },
  async run(d) {
    await d.wait(0.35);
    // compare: a second model, then a third
    await d.cam.focus(union(text("Model", { raw: true }), contains("View code")), 1.55, 1.0, { fitRect: true, dy: 60 });
    await d.move(contains("Compare"), 0.85, { at: [0.2, 0.5] });
    await d.click({ after: 0.4 });
    await d.move(box("button[aria-label='Add a third model']"), 0.6);
    await d.click({ after: 0.6 });
    // one question to all three
    await d.cam.focus(union(text("Model", { raw: true }), box(PROMPT), text("Third model", { raw: true })), 1.35, 1.0, { fitRect: true });
    await d.move(box(PROMPT), 0.7, { at: [0.2, 0.5] });
    await d.click({ after: 0.1 });
    await d.type("How does Hopscotch keep my app working when a model fails?", { cps: 34 });
    await d.wait(0.2);
    await d.move(contains("Run", { within: "main" }), 0.5);
    await d.click({ after: 0.2 });
    // and they answer side by side
    await d.move(at(box(PROMPT), 0.55, 0, 0, -200), 0.9);
    // until all three have finished streaming, then a beat to read them
    await until(d, () => { const t = document.querySelector("main").innerText; return /without a new client concept/.test(t) && /fallback/.test(t) && /before a route/.test(t) && !t.includes("▍"); }, null, 9);
    await d.wait(1.3);
    d.cam.out(1.1);
    await d.move({ x: 1010, y: 690 }, 0.9);
    await d.wait(0.6);
  },
};

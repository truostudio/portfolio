// Hopscotch: fallbacks you set once. When a model fails, the next one in line
// takes the request: one chain you read top to bottom.
import { box, text, union, at, contains, until, HOPSCOTCH_NAMES } from "./_lib.mjs";

const MAIN = "main .scroll-thin";
const SEARCH = 'input[placeholder="Provider, id, author"]';
export default {
  url: "http://localhost:5173/#/routes",
  settle: 3000,
  css: ".fixed.cursor-grab.touch-none{display:none!important}",
  // the prototype's mock data still says Uniblock, its old name
  init: HOPSCOTCH_NAMES,
  forbid: /uniblock/,
  cursorStart: { x: 1010, y: 690 },
  compose: { wall: "hopscotch", file: "hopscotch-routing" },
  async run(d) {
    await d.wait(0.35);
    // a new route
    await d.move(contains("Create route"), 0.85);
    await d.click({ after: 0.2 });
    await d.cam.focus(union(text("New route", { raw: true }), box('input[placeholder="cheap"]'), contains("Next", { within: "main" })), 2.0, 1.0, { fitRect: true, dx: 120 });
    await d.move(box('input[placeholder="cheap"]'), 0.6, { at: [0.3, 0.5] });
    await d.click({ after: 0.1 });
    await d.type("support-bot", { cps: 20 });
    await d.wait(0.15);
    await d.move(contains("Next", { within: "main" }), 0.5);
    await d.click({ after: 0.3 });
    // the chain: Claude first, then GPT, then Gemini, each if the one above fails
    await d.cam.focus(union(text("New route", { raw: true }), at(contains("Add fallback"), 0, 0, 470, 330)), 1.7, 1.0, { dy: -20 });
    await d.move(contains("Add fallback"), 0.6);
    await d.click({ after: 0.25 });
    await d.move(contains("anthropic/claude-", { n: -1, within: "main" }), 0.45);
    await d.click({ after: 0.15 });
    await d.move(box(SEARCH), 0.4, { at: [0.25, 0.5] });
    await d.click({ after: 0.05 });
    await d.type("gpt-5.6", { cps: 18 });
    await d.wait(0.2);
    await d.press("Enter");
    await d.wait(0.3);
    await d.move(contains("Add fallback"), 0.5);
    await d.click({ after: 0.25 });
    await d.move(contains("anthropic/claude-", { n: -1, within: "main" }), 0.45);
    await d.click({ after: 0.15 });
    await d.move(box(SEARCH), 0.4, { at: [0.25, 0.5] });
    await d.click({ after: 0.05 });
    await d.type("gemini-3.7", { cps: 18 });
    await d.wait(0.2);
    await d.press("Enter");
    await d.wait(0.5);
    // review it as one line, and create it
    await d.move(contains("Next", { within: "main" }), 0.6);
    await d.click({ after: 0.25 });
    await d.cam.focus(union(text("support-bot", { raw: true }), contains("Create route", { within: "main" })), 1.9, 0.9, { fitRect: true });
    await d.move(at(contains("gpt-5.6", { sel: "*", n: -1 }), 0.5, 0.5, 0, 34), 0.6);
    await d.wait(0.5);
    await d.move(contains("Create route", { within: "main" }), 0.5);
    await d.click({ after: 0.35 });
    d.cam.out(1.1);
    await d.move({ x: 1010, y: 690 }, 0.9);
    await d.wait(0.6);
  },
};

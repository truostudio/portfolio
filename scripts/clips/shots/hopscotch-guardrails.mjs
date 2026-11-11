// Hopscotch: spend controls for every key and every teammate, so an agent
// looping overnight never becomes a surprise bill.
import { box, text, union, at, contains, swapText, HOPSCOTCH_NAMES, rewrite } from "./_lib.mjs";

const MAIN = "main .scroll-thin";
export default {
  url: "http://localhost:5173/#/guardrails",
  settle: 3000,
  css: ".fixed.cursor-grab.touch-none{display:none!important}",
  // the mock team lists Rob's personal email: never in a public clip (matched
  // as any Gmail address, so it isn't written out here either)
  init: HOPSCOTCH_NAMES + rewrite({ patterns: [[String.raw`[\w.+-]+@gmail\.com`, "rob@lattice.dev"]] }),
  forbid: /gmail\.com|uniblock/,
  cursorStart: { x: 1010, y: 690 },
  compose: { wall: "hopscotch", file: "hopscotch-guardrails" },
  async run(d) {
    await d.wait(0.35);
    // what each key and person has spent against its cap
    await d.cam.focus(union(text("Production", { raw: true }), contains("$15.20", { sel: "*", n: -1 })), 1.7, 1.0, { fitRect: true, dy: 40 });
    await d.move(at(contains("$15.20", { sel: "*", n: -1 }), 0, 0.5, -360, 0), 0.9);
    await d.wait(0.5);
    await d.move(contains("Create guardrail"), 0.7);
    await d.click({ after: 0.25 });
    // a cap for the overnight agents: $10 a day
    await d.cam.focus(union(text("Create guardrail", { raw: true, n: 0 }), box('input[placeholder="No limit"]'), contains("Monthly")), 2.0, 1.0, { fitRect: true, dx: 60 });
    await d.move(box('input[placeholder="Production"]'), 0.6, { at: [0.25, 0.5] });
    await d.click({ after: 0.08 });
    await d.type("Overnight agents", { cps: 20 });
    await d.move(box('input[placeholder="No limit"]'), 0.45, { at: [0.25, 0.5] });
    await d.click({ after: 0.08 });
    await d.type("10", { cps: 10 });
    await d.move(contains("Monthly"), 0.45);
    await d.click({ after: 0.3 });
    await d.move(text("Daily"), 0.35);
    await d.click({ after: 0.3 });
    // who it covers
    await d.scroll(MAIN, 640, 1.1);
    await d.cam.focus(union(text("People", { raw: true }), contains("Create guardrail", { n: -1, within: "main" })), 1.9, 1.1, { fitRect: true, dx: 40, delay: -1.1 });
    await d.move(at(text("maya"), 0.12, 0.5), 0.6);
    await d.click({ after: 0.15 });
    await d.move(at(text("ops"), 0.12, 0.5), 0.4);
    await d.click({ after: 0.3 });
    await d.move(contains("Create guardrail", { n: -1, within: "main" }), 0.55);
    await d.click({ after: 0.45 });
    d.cam.out(1.1);
    await d.move({ x: 1010, y: 690 }, 0.9);
    await d.wait(1.0);
  },
};

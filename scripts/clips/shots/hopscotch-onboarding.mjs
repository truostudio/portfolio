// Hopscotch: onboarding that gets a developer to a first working call in
// minutes. A short welcome, a guided tour and a free first call.
import { box, vis, text, union, at, contains, until, HOPSCOTCH_NAMES } from "./_lib.mjs";

const INPUT = "input[placeholder], textarea[placeholder]";
const hasButton = t => [...document.querySelectorAll("button, a")].some(b => b.textContent.trim() === t);
export default {
  url: "http://localhost:5173/#/signup",
  settle: 900,
  css: ".fixed.cursor-grab.touch-none{display:none!important}",
  // the prototype's mock data still says Uniblock, its old name
  init: HOPSCOTCH_NAMES,
  forbid: /uniblock/,
  cursorStart: { x: 1110, y: 640 },
  compose: { wall: "hopscotch", file: "hopscotch-onboarding" },
  async run(d) {
    // the welcome, and its first question (Hopscotch's replies stream in at
    // twice their pace while nothing else happens, so the clip keeps moving)
    d.speed(2);
    await until(d, () => { const i = [...document.querySelectorAll("input[placeholder], textarea[placeholder]")].find(e => e.getBoundingClientRect().width > 0); return /team or project name works well/i.test(document.body.innerText) && i && !i.disabled && !i.readOnly; }, null, 8);
    d.speed(1);
    await d.wait(0.3);
    await d.cam.focus(vis(INPUT), 1.45, 1.1, { dy: -190 });
    await d.move(vis(INPUT), 0.85, { at: [0.2, 0.5] });
    await d.click({ after: 0.1 });
    await d.type("lattice", { cps: 12 });
    await d.wait(0.15);
    await d.press("Enter");
    d.speed(2);
    // which tool: Claude Code
    await until(d, hasButton, "Claude Code", 6);
    d.speed(1);
    await d.wait(0.3);
    await d.move(contains("Claude Code", { sel: "button" }), 0.6);
    await d.click({ after: 0.2 });
    d.speed(2);
    await until(d, hasButton, "Skip", 6);
    d.speed(1);
    await d.wait(0.35);
    await d.move(contains("Skip", { sel: "button", n: -1 }), 0.55);
    await d.click({ after: 0.2 });
    // the key, set up for that tool
    d.speed(2.4);
    await until(d, hasButton, "Open lattice", 9);
    d.speed(1);
    await d.cam.focus(union(contains("Copy"), contains("Open lattice")), 1.55, 1.1, { fitRect: true });
    await d.move(contains("Copy"), 0.7);
    await d.click({ after: 0.6 });
    await d.move(contains("Open lattice"), 0.6);
    await d.click({ after: 0.3 });
    // into the workspace, and the tour
    await until(d, hasButton, "Start the tour", 5);
    await d.cam.focus(union(contains("Start the tour"), text("Playground", { n: 0 })), 1.7, 1.1, { fitRect: true, dy: -30 });
    await d.wait(0.3);
    await d.move(contains("Start the tour"), 0.8);
    await d.click({ after: 0.3 });
    await until(d, hasButton, "Next", 3);
    await d.wait(1.3);
    d.cam.out(1.1);
    await d.wait(1.3);
  },
};

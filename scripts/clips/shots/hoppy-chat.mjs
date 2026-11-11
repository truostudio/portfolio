// Hoppy: everything a Hoppy makes lands in its chat, in the form its harness
// made it, each drawn as itself and opened big in one tap. Starts in a job's
// chat, full screen, no floor: the pricing job's web pages, stepped through in
// the viewer, then a pull request from another job.
// (The legacy design's demo, the only one that still has the coding jobs.)
import { box, union, at, contains, until } from "./_lib.mjs";

const MSGS = ".t-msgs";
const card = t => contains(t, { sel: "button.oc" });
const VIEW = ".ov-sheet";
export default {
  url: "http://localhost:5317/demo?version=legacy#/chat/job/pricing",
  settle: 5000,
  css: ".vpick,.states,#hoppy-comments{display:none!important}",
  // never a date the launch might be read from
  forbid: /uniblock|15 nov|nov(ember)? 15/,
  cursorStart: { x: 1150, y: 640 },
  compose: { wall: "hoppy", file: "hoppy-chat" },
  async run(d) {
    await d.wait(0.4);
    // up the thread to where Mochi's pages landed
    await d.cam.focus(box(MSGS), 1.35, 1.1, { fitRect: true });
    await d.move(at(box(MSGS), 0.6, 0.55), 0.8);
    const dy = await d.run(() => { const m = document.querySelector(".t-msgs"); const c = [...m.querySelectorAll("button.oc")].find(b => b.textContent.includes("Usage meter")); return c.getBoundingClientRect().top - m.getBoundingClientRect().top - 120; });
    await d.scroll(MSGS, dy, 1.4);
    await d.wait(0.4);
    // open one big, and step through
    await d.move(card("Usage meter"), 0.6);
    await d.click({ after: 0.3 });
    await until(d, () => !!document.querySelector(".ov-sheet"), null, 3);
    await d.cam.focus(box(VIEW), 1.08, 0.9, { fitRect: true });
    await d.wait(0.8);
    await d.move(box('.ov-sheet [aria-label="The next one"]'), 0.7);
    await d.click({ after: 1.1 });
    await d.click({ after: 1.1 });
    // back to the chat, and into another job's: a pull request
    await d.move(box('.ov-sheet [aria-label="Close"]'), 0.7);
    await d.click({ after: 0.4 });
    d.cam.out(1.0);
    await d.move(contains("flaky tests", { sel: "a", within: ".s-list" }), 0.8);
    await d.click({ after: 0.5 });
    await until(d, () => !!document.querySelector(".t-msgs button.oc"), null, 3);
    await d.cam.focus(box(MSGS), 1.35, 1.0, { fitRect: true });
    await d.move(contains("Pull request", { sel: "button.oc", n: -1 }), 0.7);
    await d.click({ after: 0.3 });
    await until(d, () => !!document.querySelector(".ov-sheet"), null, 3);
    await d.cam.focus(box(VIEW), 1.08, 0.9, { fitRect: true });
    await d.wait(1.6);
    d.cam.out(1.0);
    await d.wait(0.8);
  },
};

// Hoppy (V0): hiring a Hoppy is picking a role, then building the computer it
// works on, then a short moment while it moves in.
import { box, union, at, contains, until } from "./_lib.mjs";

const REST = { x: 820, y: 600 };
const FIELDS = ".cr-fields";
// scroll the setup form so a section's heading sits near the top of it
const scrollTo = async (d, label, dur = 0.9) => {
  const dy = await d.run(l => {
    const f = document.querySelector(".cr-fields");
    const h = [...f.querySelectorAll("*")].find(e => e.childElementCount === 0 && e.textContent.trim() === l);
    return h ? h.getBoundingClientRect().top - f.getBoundingClientRect().top - 12 : 0;
  }, label);
  await d.scroll(FIELDS, dy, dur);
};
export default {
  url: "http://localhost:5317/demo?version=v0x",
  settle: 5000,
  css: ".vpick,.states{display:none!important}",
  dpr: 2.5,
  cursorStart: REST,
  compose: { wall: "hoppy", file: "hoppy-create" },
  async run(d) {
    await d.wait(0.4);
    await d.move(box("[data-create]"), 0.9);
    await d.click({ after: 0.5 });
    await d.cam.focus(box(".modal"), 1.15, 1.0);
    // pick a role: look along the roster
    await d.move(contains("Pick a role", { sel: ".modal *", n: -1 }), 0.7);
    await d.click({ after: 0.6 });
    await d.cam.focus(box(".modal"), 1.2, 0.8, { dy: 30 });
    await d.move(contains("Designer", { sel: ".modal button", n: 0 }), 0.6);
    await d.click({ after: 0.55 });
    await d.move(contains("Researcher", { sel: ".modal button", n: 0 }), 0.45);
    await d.click({ after: 0.8 });
    await d.move(contains("Choose", { sel: ".modal button", n: -1 }), 0.6);
    await d.click({ after: 0.5 });
    // its harness
    await until(d, () => !!document.querySelector(".cr-fields"), null, 3);
    await d.move(at(box(FIELDS), 0.6, 0.5), 0.5);
    await scrollTo(d, "Harness", 1.0);
    await d.move(contains("Claude Code", { within: FIELDS, sel: "button" }), 0.55);
    await d.click({ after: 0.3 });
    // and the computer it works on
    await scrollTo(d, "Its computer", 1.1);
    await d.cam.focus(union(contains("Its computer", { sel: ".cr-fields h3" }), box('.cr-fields [title="320 GB of storage"], .cr-fields [aria-label="320 GB of storage"]'), box(".cr-fields .cr-pcline")), 1.8, 1.0, { fitRect: true, dy: 30 });
    await d.move(box('.cr-fields [title="Big repos, many tests"], .cr-fields [aria-label="Big repos, many tests"]'), 0.6);
    await d.click({ after: 0.5 });
    await d.move(box('.cr-fields [title="32 GB of memory"], .cr-fields [aria-label="32 GB of memory"]'), 0.5);
    await d.click({ after: 0.6 });
    // hire it, and it moves in
    await d.cam.focus(box(".modal"), 1.15, 0.9);
    await d.move(contains("Hire", { sel: ".modal button", n: -1 }), 0.7);
    await d.click({ after: 0.2 });
    await until(d, () => /is ready/.test(document.querySelector(".modal")?.innerText || ""), null, 12);
    await d.wait(1.6);
    d.cam.out(1.1);
    await d.wait(1.0);
  },
};

// Hopscotch's marketing site: the hero plays the product itself, then a
// scroll down the homepage.
import { text, union, at } from "./_lib.mjs";

export default {
  url: "http://localhost:5174/",
  settle: 3000,
  cursorStart: { x: 1060, y: 610 },
  compose: { wall: "hopscotch", file: "hopscotch-site" },
  async run(d) {
    await d.wait(0.9);
    // down to the product window under the hero, which plays itself
    await d.move({ x: 1110, y: 470 }, 1.0, { arc: 0.04 });
    await d.scroll(null, 470, 1.3);
    await d.cam.focus({ x: 260, y: 150, w: 920, h: 640 }, 1.35, 1.3, { delay: -1.3 });
    await d.wait(3.5);
    // and on down the page
    d.cam.out(1.2);
    await d.scroll(null, 1400, 1.6);
    await d.wait(1.3);
    await d.scroll(null, 1150, 1.6);
    await d.wait(1.3);
    await d.scroll(null, 760, 1.3);
    await d.cam.focus(union(text("Streaming starts sooner on every model we measured.", { raw: true }), at(text("Streaming starts sooner on every model we measured.", { raw: true }), 0, 0, -620, 120)), 1.4, 1.3, { fitRect: true, delay: -1.0 });
    await d.wait(2.2);
    d.cam.out(1.1);
    await d.wait(1.1);
  },
};

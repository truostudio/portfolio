// Hoppy's mascot system, from /mascots: drawn flat but placed in 3D, so every
// hat, scarf and accessory turns with it. Its color is the model it thinks with.
// Framed half a row at a time (rects in page px, measured on the sheet at 1440 wide).

export default {
  url: "http://localhost:5317/mascots",
  settle: 5000,
  dpr: 2.5,
  // the review comments' tab is review chrome
  css: "#hoppy-comments{display:none!important}",
  cursorStart: { x: 1260, y: 760 },
  compose: { wall: "hoppy", file: "hoppy-mascot", hideCursor: true },
  async run(d) {
    await d.wait(0.5);
    // the turnaround, all the way round
    await d.cam.focus({ x: 16, y: 40, w: 700, h: 180 }, 2.0, 1.3, { fitRect: true });
    await d.wait(1.6);
    await d.cam.focus({ x: 720, y: 40, w: 700, h: 180 }, 2.0, 1.6, { fitRect: true });
    await d.wait(1.6);
    // dressed as characters
    d.cam.out(1.1);
    await d.scroll(null, 1360, 1.5);
    await d.cam.focus({ x: 16, y: 40, w: 720, h: 440 }, 2.0, 1.2, { fitRect: true, delay: -0.5 });
    await d.wait(2.4);
    // accessories, turned with it
    d.cam.out(1.1);
    await d.scroll(null, 1110, 1.5);
    await d.cam.focus({ x: 16, y: 250, w: 700, h: 140 }, 2.0, 1.2, { fitRect: true, delay: -0.5 });
    await d.wait(1.6);
    await d.cam.focus({ x: 720, y: 250, w: 700, h: 140 }, 2.0, 1.6, { fitRect: true });
    await d.wait(1.8);
    d.cam.out(1.1);
    await d.wait(1.0);
  },
};

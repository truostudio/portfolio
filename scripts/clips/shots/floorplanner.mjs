// Floorplanner (Floorplan Studio): paste a furniture link, it reads the real
// dimensions off the product page and drops a true-scale piece on the plan,
// then the pieces get dragged into place.
//
// PRIVACY: Rob's plan is named after his real address, and its floorplan image
// shows it. The plan is seeded here under a neutral name, with no image, and
// `forbid` stops the recording if any address text ever shows on screen.
// No menus, file dialogs or the browser chrome are ever shown.
import { readFileSync } from "node:fs";
import path from "node:path";

const HERE = path.join(import.meta.dirname, "floorplanner");
const SOFA = "https://www.article.com/product/21205/burrard-83-5-sofa-seasalt-gray";
const TABLE = "https://www.ikea.com/ca/en/p/lack-coffee-table-black-brown-40104294/";
const FIX = { [SOFA]: readFileSync(path.join(HERE, "sofa.json")), [TABLE]: readFileSync(path.join(HERE, "table.json")) };

// Rob's own plan (walls, doors and furniture traced from his floorplan),
// saved without its floorplan image, its name, product links or prices, under
// a neutral name (built from his saved layout; the image held the address).
// The sofa and coffee table are left out: the shot imports them.
const PLAN = JSON.parse(readFileSync(path.join(HERE, "plan.json"), "utf8"));

const rect = fn => async page => {
  const r = await page.evaluate(fn);
  if (!r) throw new Error("target not found");
  return r;
};
const box = sel => rect(new Function(`const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height };`));
const room = name => rect(new Function(`const t = [...document.querySelectorAll("g.room text")].find(t => t.textContent.trim() === ${JSON.stringify(name)}); if (!t) return null; const b = t.closest("g.room").getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height };`));
// a placed piece, by the start of its name (its <title>), measured by its body rather than its rotate stem
const piece = name => rect(new Function(`const t = [...document.querySelectorAll("g.item > title")].find(t => t.textContent.startsWith(${JSON.stringify(name)})); if (!t) return null; const g = t.parentElement; const body = g.querySelector("rect") || g; const b = body.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height };`));

export default {
  url: "http://localhost:5183/",
  settle: 3000,
  // wide enough that the inspector is a column of its own, never over the plan
  viewport: { w: 1200, h: 960 },
  dpr: 2.5,
  scheme: "dark",
  // the plan has no front door traced, so the sofa reads as too big for every
  // door in it; that warning is the plan's gap, not the app's, so it's off here
  css: ".issue-chip{display:none!important}",
  forbid: /bloor|1713|suite\b|85 b|street east/,
  storage: `try { localStorage.setItem("floorplan-studio:autosave", ${JSON.stringify(JSON.stringify(PLAN))}); } catch (e) {}`,
  cursorStart: { x: 700, y: 820 },
  // the card crops the square to about 0.79 of its width: the window fits inside that
  compose: { w: 1080, h: 1080, pad: 134, cropX: 0.79, wall: "classic", file: "floorplanner", radius: 12 },
  async setup(page) {
    await page.click('button[aria-label="Fit on screen"], button[title="Fit on screen"]');
    await page.waitForTimeout(600);
    await page.mouse.move(700, 820);
  },
  async run(d) {
    const { page } = d;
    // product pages come from the saved responses, held until the shot lets them go
    let release = null;
    await page.route("**/api/product**", async route => {
      const u = new URL(route.request().url()).searchParams.get("url");
      await new Promise(r => { release = r; });
      route.fulfill({ status: 200, contentType: "application/json", body: FIX[u] });
    });
    // step frames until something is on the page (never longer than 3 s)
    const until = async fn => { let n = 0; for (; n < 180 && !(await page.evaluate(fn)); n++) await d.wait(1 / 60); if (n >= 180) console.log("until timed out:", await page.evaluate(() => JSON.stringify({ input: document.querySelector('input[placeholder^="ikea"]')?.value, note: document.querySelector(".import-form")?.parentElement?.innerText.slice(0, 300), items: [...document.querySelectorAll("g.item > title")].map(t => t.textContent) }))); };
    const answer = async s => { await d.wait(s); while (!release) await d.wait(1 / 60); release(); release = null; };

    const input = 'input[placeholder^="ikea"]', add = ".import-form .btn-primary";
    // the width it read off the product page
    const width = rect(() => { const e = document.querySelector("aside.panel-right .block input"); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
    const deg = a => rect(new Function(`const b = [...document.querySelectorAll("aside.panel-right button")].find(b => b.textContent.trim() === "${a}°"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };`));
    const deg180 = deg(180);
    const deg90 = rect(() => { const b = [...document.querySelectorAll("aside.panel-right button")].find(b => b.textContent.trim() === "90°"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    await d.wait(0.35);
    // 1. the sofa: paste its link
    await d.cam.focus(box(".import-form"), 2.6, 1.0, { dx: 110, dy: 70 });
    await d.move(input, 0.8);
    await d.click({ after: 0.08 });
    await d.paste(SOFA);
    await d.wait(0.25);
    await d.move(add, 0.35);
    await d.click({ after: 0.05 });
    await answer(0.45);
    await until(() => !!document.querySelector("aside.panel-right .block input"));
    await d.wait(0.1);
    // what it read off the page
    await d.cam.focus(box("aside.panel-right .block"), 2.5, 1.3, { dy: 40 });
    await d.move(width, 0.85, { at: [0.3, 0.5] });
    await d.wait(0.8);
    // 2. drag it onto the rug, its back to the shelf, and turn it to face the TV
    await d.cam.focus(piece("Rug"), 2.0, 1.0, { dy: 30 });
    await d.move(piece("Burrard"), 0.7);
    await d.wait(0.06);
    const rug = await d.rect(piece("Rug"));
    await d.drag({ x: rug.x + rug.w / 2, y: rug.y + rug.h * 0.812 }, 0.7);
    await d.wait(0.15);
    await d.move(deg180, 0.6);
    await d.click({ after: 0.2 });
    // 3. the coffee table, the same way
    await d.cam.focus(box(".import-form"), 2.0, 1.2, { dx: 200, dy: 110 });
    await d.move(input, 0.75);
    await d.click({ after: 0.06 });
    await d.paste(TABLE);
    await d.wait(0.2);
    await d.move(add, 0.3);
    await d.click({ after: 0.05 });
    await answer(0.4);
    await until(() => [...document.querySelectorAll("aside.panel-right button")].some(b => b.textContent.trim() === "90°") && [...document.querySelectorAll("g.item > title")].some(t => t.textContent.startsWith("LACK")));
    await d.wait(0.2);
    // turn it to lie along the sofa, then set it in front
    await d.cam.focus(async p => { const a = await piece("Rug")(p), b = await deg90(p); const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }; }, 1.85, 1.0);
    await d.move(deg90, 0.7);
    await d.click({ after: 0.15 });
    await d.move(piece("LACK"), 0.6);
    await d.wait(0.06);
    const rug2 = await d.rect(piece("Rug"));
    await d.drag({ x: rug2.x + rug2.w / 2, y: rug2.y + rug2.h * 0.319 }, 0.7);
    await d.wait(0.35);
    d.cam.out(1.0);
    await d.move({ x: 700, y: 820 }, 0.9);
    await d.wait(0.55);
  },
};

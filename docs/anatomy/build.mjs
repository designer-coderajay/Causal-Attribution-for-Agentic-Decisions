// Builds the interactive estimator bench: node build.mjs [--light]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";
import { kitScript } from "./scripts/inline-kit.mjs";
import * as rig from "./rig.mjs";
import * as g from "./parts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 820;
const HEIGHT = 400;
const { W } = g;
const REST = 0.975;

const P = k.fitProjection(
  [...k.boxCorners(W.PLATE, -17, 0), [-110, -34, 40], [50, 46, 28], [110, -52, 20]],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 62 },
);

const val = (p) => ({ marg: p.marg, crn: p.crn, de: p.direct });
const gantryOf = (p) => `<g data-part="gantry" transform="${k.translateAlong(P, [p.x, 0, 0])}">${g.gantry(P, p.press)}</g>`;
const diceOf = (p) => g.die(P, W.DICE.fresh, p.freshFace, "fresh") + g.die(P, W.DICE.same, p.sameFace, "same");
const lampsOf = (p) => g.lamp(P, 60, -62, p.lampA, "A") + g.lamp(P, 76, -62, p.lampB, "B") + g.lamp(P, 66, 8, p.zeroLamp, "exact 0");

function scene(u) {
  const p = rig.pose(u);
  const v = val(p);
  return [
    g.plate(P),
    g.rail(P),
    `<g data-part="dice">${diceOf(p)}</g>`,
    `<g data-part="lamps">${lampsOf(p)}</g>`,
    gantryOf(p),
    ...W.G.flatMap((gg) => [g.gauge(P, gg), `<path data-part="needle-${gg.key}" class="iso-line" data-tone="lit" data-free="start" d="${g.needleD(P, gg, v[gg.key])}" style="stroke-width:1"/>`]),
  ];
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A bench that works like the estimators in this paper. A rail holds four step pads: a start, an inert step A, a decisive step B and the outcome. A plunger on a gantry tests one step at a time. A fresh die and a same die show the two ways of re-rolling the noise. Three dials read the marginal effect, the same-dice effect and the direct effect. The marginal dial reads the same for A and B; the same-dice dial separates them; the direct effect of B reads 0.25; and on about one run in ten the same-dice dial reads exactly zero for B.",
  body: scene(REST),
});

const strip = (file) => readFileSync(join(HERE, file), "utf8").replace(/^export /gm, "").replace(/^import .*$/gm, "");
const kitNames = Object.keys(k).join(", ");

const live = `
const P = ${JSON.stringify(P)};
const REST = ${REST};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const E = { gantry: part("gantry"), dice: part("dice"), lamps: part("lamps"), needles: Object.fromEntries(W.G.map((gg) => [gg.key, part("needle-" + gg.key)])) };
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const cache = {};
const put = (key, node, html) => { if (cache[key] !== html) { cache[key] = html; node.innerHTML = html; } };
const q20 = (v) => Math.round(v * 20) / 20;
let u = still.matches ? REST : 0, target = u, touring = !still.matches, frame = 0, last = 0, visible = false, idleTimer = 0;

function render() {
  const p = pose(u);
  E.gantry.setAttribute("transform", translateAlong(P, [Math.round(p.x * 4) / 4, 0, 0]));
  put("gantry", E.gantry, gantry(P, Math.round(p.press * 8) / 8));
  put("dice", E.dice, die(P, W.DICE.fresh, p.freshFace, "fresh") + die(P, W.DICE.same, p.sameFace, "same"));
  put("lamps", E.lamps, lamp(P, 60, -62, p.lampA, "A") + lamp(P, 76, -62, p.lampB, "B") + lamp(P, 66, 8, q20(p.zeroLamp), "exact 0"));
  const v = { marg: p.marg, crn: p.crn, de: p.direct };
  for (const gg of W.G) E.needles[gg.key].setAttribute("d", needleD(P, gg, v[gg.key]));
  const text = describe(u);
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.round(u * 100)));
  stage.setAttribute("aria-valuetext", text);
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) { u += dt / CYCLE; if (u >= 1) u -= 1; target = u; }
  else { u = still.matches ? target : u + (target - u) * (1 - Math.exp(-dt / 0.12)); if (Math.abs(target - u) < 0.0004) u = target; }
  render();
  frame = visible && (touring || u !== target) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const hold = () => { touring = false; clearTimeout(idleTimer); idleTimer = setTimeout(() => { touring = !still.matches; run(); }, 3600); run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (event) => { const box = svg.getBoundingClientRect(); target = clamp(((event.clientX - box.left) / box.width - 0.06) / 0.88, 0, 0.995); hold(); });
stage.addEventListener("pointerleave", () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => { touring = !still.matches; run(); }, 1200); });
stage.addEventListener("click", () => { u = target = 0; touring = !still.matches; if (still.matches) u = target = REST; clearTimeout(idleTimer); render(); run(); });
stage.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "ArrowRight" || key === "ArrowUp") target = clamp(target + 0.03, 0, 0.995);
  else if (key === "ArrowLeft" || key === "ArrowDown") target = clamp(target - 0.03, 0, 0.995);
  else if (key === "Home") target = 0;
  else if (key === "End") target = REST;
  else if (key === " " || key === "Enter") { event.preventDefault(); u = target = 0; touring = !still.matches; render(); run(); return; }
  else return;
  event.preventDefault();
  hold();
});
window.__set = (uu) => { u = target = uu; touring = false; render(); };
render();
`;

const phone = `<style>@media (max-width:560px){.iso-plate-corner[data-corner="hint"]{display:none}.iso-plate-corner[data-corner="readout"]{left:0;right:0;white-space:normal;text-align:right;font-size:9.5px;line-height:1.35}}</style>`;
const body = phone + k.plateHtml({
  fig: "Fig 1",
  title: "Estimator bench",
  hint: "Hover to scrub · click to replay",
  readout: rig.describe(REST),
  keys: [
    { mark: "lit", label: "The plunger, the tested step and the dial needles" },
    { mark: "raised", label: "A rail of steps, two dice, three dials" },
  ],
  caption:
    "A plunger tests one step of a synthetic agent chain at a time. The marginal dial re-rolls the downstream noise (the fresh die) and reads the same for the inert step A and the decisive step B. The same-dice dial keeps the noise fixed and separates them, but reads exactly zero for B on about one run in ten, where B's direct effect is 0.25. The direct effect and the zero are from the paper; the marginal and same-dice needle heights and the dice faces are illustrative. All of it is a synthetic model, not a real agent.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Estimator bench: hover to scrub, click to replay, arrow keys step" aria-valuemin="0" aria-valuemax="100" aria-valuenow="97">${svg}</div>`,
});

const script = kitScript() + `\nconst k = { ${kitNames} };\n` + strip("rig.mjs") + "\n" + strip("parts.mjs") + "\n" + live;
const file = theme === "light" ? "estimator-bench-light.html" : "estimator-bench.html";
writeFileSync(join(HERE, file), k.pageHtml({ title: "Estimator bench", theme, body, script, width: 880 }));
console.log("wrote", file);

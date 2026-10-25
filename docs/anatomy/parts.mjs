// Geometry for the underwriting bench. Every function takes the projection P and returns SVG text.
// The same file is used by build.mjs (first frame) and inlined into the page (live frames).
import * as k from "./kit/iso-kit.mjs";

export const W = {
  PLATE: { x: -196, y: -84, w: 396, d: 164, r: 9 },
  PLATE_H: 12,
  FOOT_H: 5,
  YR: -34, // the rail of steps
  CARD: { w: 24, d: 15 },
  G: [
    { key: "marg", cx: -62, cy: 46, R: 16, z: 15, h: 7, label: "marginal" },
    { key: "crn", cx: -6, cy: 46, R: 16, z: 15, h: 7, label: "same dice" },
    { key: "de", cx: 50, cy: 46, R: 16, z: 15, h: 7, label: "direct" },
  ],
  A0: -0.75 * Math.PI,
  SPAN: 1.5 * Math.PI,
  DICE: { fresh: [110, -52], same: [110, -14] },
};

const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const at = (P, p) => k.iso(p, P);
const opaque = (svg, op) => (op >= 0.999 ? svg : `<g opacity="${Math.max(0, op).toFixed(3)}">${svg}</g>`);

export function plate(P) {
  const { PLATE, PLATE_H, FOOT_H } = W;
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feet = [...k.corners(PLATE, 22), [0, PLATE.y + 22], [0, PLATE.y + PLATE.d - 22]];
  for (const [x, y] of [...feet].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const corner = k.corners(PLATE, 10);
  out.push(L(corner.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(corner.map(([x, y]) => at(P, [x, y, 0])), { size: 0.5 }));
  return out.join("");
}

export function belt(P, y, b) {
  const out = [];
  const plan = { x: b.x0, y: y - b.w / 2, w: b.x1 - b.x0, d: b.w, r: 2 };
  out.push(S(k.slabOf(plan, 0, 1.6, P, 4, 0.4), { tone: "mid" }));
  out.push(L(k.lineOnTop([b.x0, y - 6.5], [b.x1, y - 6.5], 1.6, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([b.x0, y + 6.5], [b.x1, y + 6.5], 1.6, P), { tone: "faint" }));
  out.push(L(k.topTicks(b.x0 + 4, b.x1 - 4, 6, 4, y - 9.2, 1.6, [1.2, 2.2], P).minor, { tone: "lo" }));
  out.push(D([at(P, [b.x0 + 2.6, y, 1.6]), at(P, [b.x1 - 2.6, y, 1.6])], { size: 0.45 }));
  return out.join("");
}

// the rail: four step pads in a row. s0 is the start, A is causally inert, B is decisive, y is the outcome.
export function rail(P) {
  const out = [];
  const plan = { x: -166, y: W.YR - 11, w: 152, d: 22, r: 2 };
  out.push(S(k.slabOf(plan, 0, 1.6, P, 4, 0.4), { tone: "mid" }));
  out.push(L(k.topTicks(-162, -18, 6, 4, W.YR - 9.2, 1.6, [1.2, 2.2], P).minor, { tone: "lo" }));
  for (const [x, label] of [[-150, ""], [-110, "A"], [-70, "B"], [-30, "y"]]) {
    const pad = { x: x - 15, y: W.YR - 9, w: 30, d: 18, r: 2 };
    out.push(S(k.slabOf(pad, 1.6, 1.4, P, 4, 0.3), { tone: "lo", crease: "none" }));
    out.push(S(k.slabOf({ x: x - 10, y: W.YR - 5.5, w: 20, d: 11, r: 1.2 }, 3, 1.4, P, 3, 0.3), { tone: "hi", lit: label === "B", crease: "lo" }));
    if (label) out.push(k.faceTextSvg(k.topMatrix([x - 1.8, W.YR + 17], 1.6, P, "x"), label, { size: 5, tone: "hi" }));
  }
  return out.join("");
}

// the moving gantry with its plunger; drawn at x = 0 and translated along the rail
export function gantry(P, press) {
  const out = [];
  for (const sy of [-18, 18]) out.push(S(k.slabOf({ x: -6, y: W.YR + sy - 3, w: 12, d: 6, r: 1.2 }, 0, 24, P, 3, 0.5), { tone: "mid" }));
  const beam = { x: -7, y: W.YR - 21, w: 14, d: 42, r: 1.8 };
  out.push(S(k.slabOf(beam, 24, 7, P, 4, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(beam, 2), 31, P, 4), { tone: "faint" }));
  const z = -9 * press;
  out.push(S(k.cylinder(0, W.YR, 2.2, 12 + z, 12 - z, P, 20), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(0, W.YR, 6.5, 6 + z, 6, P, 28, 0.5), { tone: "hi", lit: true }));
  out.push(L(k.knurl(0, W.YR, 6.5, 6 + z, 12 + z, 20, P), { tone: "lo" }));
  return out.join("");
}

const PIPS = { 1: [[0, 0]], 2: [[-3, -3], [3, 3]], 3: [[-3, -3], [0, 0], [3, 3]], 4: [[-3, -3], [3, -3], [-3, 3], [3, 3]], 5: [[-3, -3], [3, -3], [0, 0], [-3, 3], [3, 3]], 6: [[-3, -3], [3, -3], [-3, 0], [3, 0], [-3, 3], [3, 3]] };
export function die(P, c, n, label) {
  const [x, y] = c;
  const out = [];
  const pad = { x: x - 22, y: y - 14, w: 50, d: 28, r: 2 };
  out.push(S(k.slabOf(pad, 0, 1.6, P, 4, 0.4), { tone: "lo", crease: "none" }));
  out.push(S(k.slabOf({ x: x - 7, y: y - 7, w: 14, d: 14, r: 2 }, 1.6, 14, P, 4, 0.8), { tone: "hi", lit: true, crease: "lo" }));
  out.push(D((PIPS[n] || PIPS[1]).map(([dx, dy]) => at(P, [x + dx * 0.9, y + dy * 0.9, 15.6])), { size: 0.9, tone: "hi" }));
  out.push(k.faceTextSvg(k.topMatrix([x + 10, y + 9], 1.6, P, "x"), label, { size: 3.4, tone: "mid" }));
  return out.join("");
}

export function lamp(P, x, y, on, label) {
  const out = [S(k.cylinder(x, y, 3.2, 0, 2 + 2 * on, P, 18), { tone: on > 0.5 ? "hi" : "mid", lit: on > 0.5 })];
  out.push(L(k.ring(x, y, 5, 0, P, 18), { tone: "faint" }));
  if (label) out.push(k.faceTextSvg(k.topMatrix([x - 6, y + 11], 0, P, "x"), label, { size: 3.2, tone: "mid" }));
  return out.join("");
}

export function gauge(P, g) {
  const { cx: x, cy: y, R, z: Z, h: H } = g;
  const { A0, SPAN } = W;
  const top = Z + H;
  const out = [];
  const foot = { x: x - 13, y: y - 13, w: 26, d: 26, r: 3 };
  out.push(S(k.slabOf(foot, 0, 4, P, 5, 0.6), { tone: "mid" }));
  out.push(D(k.corners(foot, 3).map(([a, b]) => at(P, [a, b, 4])), { size: 0.4 }));
  out.push(S(k.cylinder(x, y, 3.4, 4, Z - 4, P, 24), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(x, y, R, Z, H, P, 48, 0.7), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, R, top - 3, top, 56, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(x, y, R - 2, top, P, 48), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, R - 2.6, 40, 5, top, [1.2, 2.5], P, A0, SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.5, top, P, 16), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 8.2], top, P, "x"), g.label, { size: 3, tone: "mid", anchor: "middle" }));
  return out.join("");
}
export function needleD(P, g, v) {
  const { cx: x, cy: y, R, z: Z, h: H } = g;
  const a = W.A0 + W.SPAN * v;
  return k.lineOnTop([x - Math.sin(a) * 3, y + Math.cos(a) * 3], [x + Math.sin(a) * (R - 4), y - Math.cos(a) * (R - 4)], Z + H + 0.2, P);
}



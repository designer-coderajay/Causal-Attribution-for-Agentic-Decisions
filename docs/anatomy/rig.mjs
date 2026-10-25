// The model behind the figure. Pure functions: the geometry, the motion and the readout all read from here.
// Real, from the README and docs/DERIVATIONS.md: on the planted chain the marginal total effect gives an inert step
// and the decisive step the identical value; the common-random-numbers total effect separates them; the decisive
// step's direct effect is 0.25; on about one run in ten the CRN total effect of the decisive step is exactly zero.
// Illustrative: the common needle height of the marginal dial, the CRN reading for the decisive step, and the dice.

export const DE_B = 0.25; // real
export const M = 0.45; // illustrative: the same value for A and B
export const CRN_B = 0.5; // illustrative
export const CYCLE = 30;
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const seg = (u, a, b) => clamp((u - a) / (b - a));
export const ease = (t) => t * t * (3 - 2 * t);
export const wave = (u, a, b) => Math.sin(Math.PI * seg(u, a, b));

export const SLOTS = { s0: -150, A: -110, B: -70, y: -30 };
export const T = {
  moveA: [0.03, 0.13],
  pressA: [0.13, 0.22],
  holdA: [0.22, 0.38],
  moveB: [0.38, 0.5],
  pressB: [0.5, 0.58],
  holdB: [0.58, 0.72],
  zero: [0.72, 0.86],
  fade: [0.985, 1.0],
};

export function pose(u) {
  const x = u < T.moveB[0] ? SLOTS.s0 + (SLOTS.A - SLOTS.s0) * ease(seg(u, ...T.moveA)) : SLOTS.A + (SLOTS.B - SLOTS.A) * ease(seg(u, ...T.moveB));
  const press = Math.max(wave(u, ...T.pressA), wave(u, ...T.pressB));
  const onA = u >= T.pressA[0] && u < T.moveB[0];
  const onB = u >= T.pressB[0];
  // needles: marginal reads the same for A and B; CRN separates them; direct is known for B
  const marg = M * ease(seg(u, T.pressA[0] + 0.03, T.pressA[1] + 0.03));
  const zeroDip = wave(u, ...T.zero);
  const crn = onB ? CRN_B * ease(seg(u, T.pressB[0] + 0.03, T.pressB[1] + 0.03)) * (1 - zeroDip) : 0;
  const direct = onB ? DE_B * ease(seg(u, T.pressB[0] + 0.03, T.pressB[1] + 0.03)) : 0;
  // dice: the fresh die is re-rolled while a step is being tested; the same die never changes
  const reroll = Math.floor(u * 60) % 6;
  return {
    u,
    x,
    press,
    marg,
    crn,
    direct,
    onA,
    onB,
    zeroLamp: seg(u, T.zero[0] + 0.02, T.zero[0] + 0.05) * (1 - seg(u, T.zero[1] - 0.04, T.zero[1])),
    freshFace: onA || onB ? reroll + 1 : 1,
    sameFace: 3,
    lampA: onA ? 1 : 0,
    lampB: onB ? 1 : 0,
  };
}

export function describe(u) {
  const p = pose(u);
  if (u < T.pressA[0]) return "pick a step to test";
  if (u < T.moveB[0]) return "step A (inert): marginal and same-dice readings";
  if (u < T.pressB[0]) return "now the decisive step B";
  if (u < T.zero[0]) return `step B: marginal reads the same as A; same-dice separates them; direct effect ${p.direct.toFixed(2)}`;
  if (u < T.fade[0]) return "on about one run in ten the same-dice reading is exactly 0 for B";
  return "ready for the next trajectory";
}

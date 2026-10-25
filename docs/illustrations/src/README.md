# Illustration sources

The three images one level up are drawn by `p2.py` with the small kit in `xh.py` (wobbly black lines, a black creature with white dot eyes, orange for the path, red for the key point, blue for side notes). They are hand-authored vector drawings, not AI-generated art.

```bash
python3 p2.py                                                    # writes 16-fresh-or-same-dice.svg, 17-zero-is-not-nothing.svg, 18-evidence-gap.svg
node render.js 16-fresh-or-same-dice 17-zero-is-not-nothing 18-evidence-gap   # needs playwright with Chromium; writes the PNGs
```

The lettering font is Caveat (SIL Open Font License 1.1), embedded in each SVG from `caveat-latin-600-normal.woff2`.

The drawings show no measured data. The numbers in them (direct effect 0.25, about 1 run in 10) and the two dates are taken from the paper as stated in the main README; the dice and the dial are illustrative. Regulatory dates change: check the Official Journal.

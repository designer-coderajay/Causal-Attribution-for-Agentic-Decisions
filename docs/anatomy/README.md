# Estimator bench: the interactive figure

An isometric, interactive drawing of the paper's central comparison, built with the [Anatomy](https://github.com/wheresryan22/anatomy) Agent Skill by Ryan (MIT). A plunger tests one step of a synthetic agent chain at a time. Two dice show the two ways of re-rolling the noise, and three dials read the marginal effect, the same-dice effect and the direct effect.

| File | What it is |
|---|---|
| `estimator-bench-light.html` | The figure, light theme. Standalone: open it in a browser. |
| `estimator-bench.html` | The same figure, dark theme. |
| `estimator-bench.gif` | A recording of one full cycle, used in the main README. |
| `estimator-bench.png` | A still of the finished state. |
| `rig.mjs` | The model: the numbers taken from the paper and the timeline. |
| `parts.mjs` | The geometry of every part, shared by the build and the live page. |
| `build.mjs` | Writes the HTML pages. |
| `kit/`, `scripts/` | The Anatomy drawing kit and its capture and line-check scripts, copied unchanged. `LICENSE-anatomy` is its licence. |

## Use it

Hover to scrub through the cycle, click or press Space or Enter to replay, arrow keys to step, Home and End to jump. The figure tours by itself when left alone and shows one still frame under reduced motion.

```bash
node build.mjs --light   # writes estimator-bench-light.html  (Node 20.10 or later, nothing to install)
node build.mjs           # writes estimator-bench.html
node scripts/lines.mjs estimator-bench-light.html --reduced   # every drawn line must end on something (needs Chrome; set CHROME_PATH)
```

## What is real and what is drawn

Real, from the paper and `README.md`: on the planted chain the marginal total effect gives the inert step and the decisive step the identical value; the same-dice (CRN) total effect separates them; the decisive step's direct effect is 0.25; on about one run in ten the CRN total effect of the decisive step is exactly zero.

Drawn for the picture: the common height of the marginal needle, the same-dice reading for the decisive step, and the dice faces. Everything is a synthetic model, not a real agent, and the figure makes no statistical claim.

# P2 Research Log

Append-only. Dated. What was run and what was learned.

## 2026-08-13

**Scope.** Literature and design session. No compute. P1's specification sweep is the owning project this week; this session is reading and writing only, which does not contend for GPU.

**Ran.** Four web searches verifying the P2 kill-gate papers and scanning for prior art on intervention-based agent attribution.

**Learned, and it changes the paper.**

1. arXiv 2605.09168 (CIVeX) and 2607.25364 (EBTE), the two papers the brief named as kill-gate threats, both VERIFIED to exist and both **cleared**. Both are ex ante gatekeepers deciding whether a proposed action should execute. P2 is post hoc attribution over an executed trajectory. Different object.

2. **arXiv 2606.08275, Causal Agent Replay, is the real threat and was absent from the brief.** VERIFIED. It contains an SCM over agent runs, a do-operation with run-forward under the same stochastic policy, an intervention algebra over steps, a Monte Carlo Shapley estimator, confidence intervals throughout, an action-match rate for replay, and the framing that observability answers what happened but not what caused it. That overlaps section 4 of the brief nearly line for line.

3. Also found: 2605.25338 (CausalFlow), 2606.09692 (Observability for Delegated Execution, proves a non-identifiability result about audit logs and delegation scope), and a prior chain via 2505.00212 (Who&When) and 2509.03312 (AgenTracer).

**Consequence.** The flagship rationale in section 1 of the brief does not survive. The intervention algebra and Shapley estimator are prior art. What survives: the measured object is regulated decisions rather than failures, the comparison is a rank-agreement plus bias decomposition rather than a scalar accuracy, the ME/DE decomposition (pending confirmation that CAR has no DE arm), and the Annex IV conversion.

**Written.** `docs/POSITIONING.md`, `docs/P2-RESEARCH-PLAN.md` (revision 2), `docs/CITATION-LEDGER.md`, this log. Two skills created: `p2-research-protocol`, `agentic-intervention-design`.

**Also flagged, not P2's to resolve.** The P3 kill gate was dated 10 August. Its outcome is not recorded in this chat. If it failed, reallocation has already changed P2's calendar.

**Next.** Full read of 2606.08275, priority one, deadline 15 August. The specific question: does it have a direct-effect arm and any observability comparison beyond the single Who&When number. Gate A on 24 August, Ajay re-scores.

**Open for Ajay.** Five decisions listed in `docs/P2-RESEARCH-PLAN.md` section 11.

## 2026-08-13, second entry

**Sprint declared.** Ajay compressed P2 to 13 to 31 August, 15 hours per day, arXiv 31 August. Plan written to `docs/AUGUST-SPRINT.md`. Daily log opened at `docs/DAILY.md`.

Cuts: Stage 3 Shapley dropped (prior art, CAR ships it), third-party framework arm dropped, second system reduced, N set by power simulation rather than the undelivered N >= 300 figure. Kept: DE/ME decomposition, the five attributors, the bias decomposition, pre-registration, Annex IV spec.

Five gates, all moved forward. Gate A is 14 August and it decides whether the remaining 250 hours happen at all.

Flagged to Ajay: P1's 24 to 31 August analysis window collides with this sprint; recommended P1 slips to 1 to 5 September. Also flagged that P2 will now appear on arXiv before P1, inverting the intended reading order.

## 2026-08-13, third entry

**GATE A PASSED, a day early.** Full text of arXiv 2606.08275v1 fetched and read.

Four things confirmed, all VERIFIED from the full text:
1. Sec 7: isolating a step direct effect "is left as a refinement". No DE arm. H4 and the ME decomposition are open, and named by the authors as future work.
2. No observability comparison anywhere in the paper beyond the cited Who&When 14 percent figure. H1, H2, H3 untouched.
3. Sec 7: real tools with side effects are out of scope; demonstrations use mocked, reproducible tools; validation is against synthetic SCMs. The live-BFSI differentiator is conceded in print.
4. Sec 6: CAR explicitly disclaims novelty on counterfactual replay and Shapley for agent blame. Field commons, not their property.

Six decisions taken and logged at the foot of docs/POSITIONING.md. Most consequential: adopt CAR five-operator algebra (do_resample, do_action, do_observation, do_context, do_policy) rather than the remove/resample/corrupt triple, and add a head-to-head of ME/DE against their point-of-commitment locus rule as a named contribution.

Citation ledger gained nine references harvested from CAR bibliography, including the Pearl reference that was load-bearing and unverified: Causality: Models, Reasoning, and Inference, CUP, 2nd ed, 2009. Marked VERIFIED-SECONDARY pending a library record.

Residual risk: 2605.25338 and 2509.08682 unread. On the D2 calendar.

## 2026-08-20

**Scope.** Gate D day, handed to a Cowork session via `docs/HANDOVER.md`. Full
repo review top to bottom against the incoming state (`verify.sh` ALL GREEN,
git log to `10f7cbd`), then work on the two OPEN items HANDOVER listed as
blocking the gate.

**Resolved.** PREREG s2's ratio-to-causal convention for reporting Plackett-Luce
coefficients was identification-broken: it divides by `beta_causal`, and both
H1 and H2 predict `beta_causal` is small, so the convention was guaranteed to
misbehave exactly in the regime the paper is built to detect. Confirmed on the
project's own dry-run numbers (`beta_causal = -0.029` producing a "ratio to
causal" of -26.7 for verbosity, unbounded under an arbitrarily small
perturbation of `beta_causal`). Fixed by reporting `beta / ||beta||_2`
(coefficient direction on the unit sphere, exactly invariant to the same PL
scale ambiguity, well-defined whenever any coefficient carries signal) with a
decision-level bootstrap confidence interval, matching the bootstrap-over-
decisions convention already locked for every other interval in the paper.
Six new validation checks in `scripts/validate_primary.py`, all passing,
including confirmation that the primary contrast's Wald test itself was never
affected (it is algebraically invariant to the scale ambiguity that broke the
ratio). Full derivation: `docs/DERIVATIONS.md` Part V. Deviation logged in
`docs/DAILY.md` the same day per PREREG s7.

**Not resolved.** The second OPEN item, `sigma_resid` for the corpus-size power
rule, needs a Stage 0 measurement against the live BFSI pipeline. Gates B, C, E
remain blocked on pipeline access, overdue since 17 August. This is not
resolvable without either the live system or fabricating a number, and the
standing rules forbid the second option. **This is the single item blocking
further empirical progress on P2 and it needs Ajay's action, not more
analysis.**

**Backfilled.** DAILY.md had no entries between D4 (16 Aug) and today, despite
five days of committed work (WS1.6, H1/H2 machinery, Plackett-Luce, WS3.3
provenance audit, the pre-registration draft, the primary contrast, H4, the
separation guard and its correction, the mediation safety test, the first
end-to-end dry run). Reconstructed retroactively from git log and flagged as
such rather than presented as a same-day record.

**Next.** Blocked on Ajay: (1) BFSI pipeline access for Stage 0 / Gates B, C, E,
(2) a decision on whether today's fix satisfies Gate D or the gate stays open
pending a second read. Not blocked, and available to continue in parallel:
WS0 remaining citation verification, WS6 Annex IV drafting, WS1.7/1.9.

## 2026-08-21

**Scope.** Two pieces of work. First a provenance repair, then the WS0 citation
verification sweep that had been sitting since 13 August.

**Provenance repair, committed and pushed.** `requirements.txt` said
`numpy>=1.26`, a floor rather than a pin, and three numpy versions had produced
artifacts in `results/`: 1.26.4 on the machine of record, 2.2.6 from a stray
interpreter, 2.4.4 from a cloud session. Standing rule 10 requires a pinned
environment and that was not a true statement about the repo. Pinned to
`numpy==1.26.4`; `validate_mediation.py` now records numpy so the fingerprint is
uniform across all seven artifacts; every artifact regenerated on the machine of
record. Verified field-by-field against HEAD before committing: worst non-env
delta 1.110e-16, everything else bit-identical, so this was pure provenance and
no claim moved. `git fsck` clean, which also retires the iCloud-corruption worry
flagged in PUSH.md. Commits `6b3d2f6` and `c91b3f4` are now on the private
GitHub remote, verified by SHA match after fetch.

**Citation sweep, five parallel verifications against primary sources.** This is
the substantive result of the day.

1. **A wrong citation was caught before it reached the bibliography.** 2509.08682
   was recorded as "Automatic Failure Attribution and Critical Step Prediction via
   Causal Inference" by "Y. Ma et al.". Both title and first author are wrong. The
   actual title is "... Method for Multi-Agent Systems Based on Causal Inference"
   and the first author is **Guoqing Ma**; the only "Y." initial belongs to the
   last author. It sat in the ledger for eight days marked RECALLED. Standing
   rule 1 exists for exactly this and the ledger discipline worked.

2. **On substance 2509.08682 clears P2**, verified from full text: static logs,
   no re-execution for attribution, zero occurrences of mediation or direct
   effect, Shapley over agents rather than steps, no regulatory content. One
   qualification worth pre-empting in related work: it compares trace-reading
   LLM-judge baselines against its causal method, but scores both against human
   annotation rather than against causal ground truth, so it is not a measurement
   of whether observability tracks causation. That gap is still ours.

3. **The Who&When 14.2% figure is real but three obvious ways of citing it are
   wrong.** It appears exactly once in the paper, in the abstract, in no table,
   and is the mean of four Table 1 cells. The best single cell is 25.51%. More
   importantly, **on realistic hand-crafted long logs it is 7.02 and 8.77 against
   a 4.16 random baseline**. If P2's argument is about long-horizon traces the
   honest number is single-digit, which is stronger for the thesis than 14.2%.

4. **The delegation non-identifiability result is narrower than recorded and
   must be cited more carefully.** 2606.09692 proves the *authorization relation*
   is non-identifiable, as a Proposition whose proof defines the observation
   function to discard the quantity. It is a scoping result, not an impossibility
   barrier. Cite as "must be bound at execution time", never as "attribution from
   logs is impossible". It also has zero EU AI Act content, so the regulatory
   bridge in WS6 is entirely ours and must not be attributed to them. Vendor
   paper, no seeds or CIs on its metrics.

5. **The replay floor needs batch invariance, and our stated precondition was
   wrong.** DERIVATIONS section 14 listed "single-stream inference" as a
   precondition. The primary source does not claim that. The forward pass is
   already run-to-run deterministic; nondeterminism comes from lack of batch
   invariance under varying server load; temperature 0 plus a fixed seed is not
   sufficient, and their measurement is 80 unique completions from 1000
   temperature-0 samples, collapsing to 1 with batch-invariant kernels.
   Determinism is also not version-invariant. **This changes what Gate C is
   asking**: not "can we replay" but "can we obtain batch-invariant inference on
   the serving stack we have". Written up as DERIVATIONS section 15.

6. **Pearl attribution improved.** Pearl 2009 is now verified against the Stanford
   library record and CUP catalogue rather than CAR's bibliography, sections 4.5.4
   and 4.5.5 located, and 2nd edition confirmed as necessary. But Pearl (2001)
   UAI is the standard primary citation for the natural direct effect, with Robins
   & Greenland (1992) holding priority. All three now cited in DERIVATIONS s4.

Also cleared: AttriGuard 2603.10749 and CausalArmor 2602.07918, both ex ante
guardrails, both with titles and author lists exactly as believed. AgenTracer
oracle-substitution basis confirmed, with the qualification that it is only the
failed-trajectory half of the method. Castro et al. 2009 fully verified, surname
takes an accent, Gómez.

**Operational finding.** One verification agent had its scratchpad file
overwritten mid-task by a concurrent process. It detected the substitution,
re-fetched in isolation, and re-derived every quote. Parallel verification must
use isolated working directories; silent cross-contamination between two citation
checks would be very hard to catch after the fact.

**What is now the single load-bearing unverified item.** Regulation (EU)
2024/1689 primary text, Articles 11, 12, 13, 86 and Annex IV. The entire WS6
deliverable rests on it and no verified reading exists. Nothing else on the
RECALLED list is close in importance.

**Still blocked on Ajay, now five days overdue.** BFSI pipeline access for Stage
0, which gates B, C, E and the `sigma_resid` number for the corpus-size rule.
Unchanged since 17 August and not substitutable by any work I can do.

## 2026-08-23

**Scope.** Status check after a two-day gap, then repair of two integrity
defects found by that check. A parallel session had committed `4e8de3c` on 23
August touching `src/p2/ranking.py` and the ledger.

**What the other session did, and it was right to.** It lifted `CAUTION_K = 2.0`
out of an inline literal in `normalized_beta` into a named constant, on the
correct reasoning that a threshold deciding whether a reader is told to distrust
the reported direction is an analysis choice, not an implementation detail. It
also caught a citation failure of mine (below).

**DEFECT 1, in the incoming commit: a pre-registration claim that was not true.**
`ranking.py` carried the comment "Pre-registered constant, PREREG s2" while
`preregistration/PREREG.md` contained **zero** occurrences of `CAUTION_K`, and
that commit did not touch PREREG. Committed code asserting a pre-registration
that does not exist is precisely the failure this programme's thesis is about,
and a reviewer checking the claim would find it immediately.

Resolved by making the claim true rather than deleting it, since the underlying
instinct was correct: `CAUTION_K = 2.0` is now LOCKED in PREREG s2 with its
rationale and with the provenance of the discrepancy recorded openly. This is
legitimate rather than retrospective **only** because Gate D is unsigned and no
pooled result has been inspected, which is the condition PREREG s9 sets. Had
either been false, the honest action would have been to strike "pre-registered"
from the code instead. Stated in the PREREG entry itself so the reasoning is
auditable.

**DEFECT 2, mine: a citation reached committed source without reaching the
ledger.** The `normalized_beta` docstring I committed on 20 August cites
"(Fieller 1954)" as the authority for the ratio-of-normals argument that
justifies the paper's headline reporting convention. I never added it to the
ledger. It sat in committed source, in a RECALLED state, inside the
justification for a pre-registered analysis choice, and would have travelled
into the manuscript's methods section unchecked. The other session caught it by
eye and logged it RECALLED.

Verified today: E. C. Fieller, "Some Problems in Interval Estimation", *JRSS
Series B (Methodological)* 16(2):175-185, July 1954, DOI
10.1111/j.2517-6161.1954.tb00159.x, confirmed against the Oxford Academic
record and corroborated by the Wiley DOI page and the JSTOR volume listing.
Upgraded to VERIFIED.

**The lesson is about scope and it is now enforced mechanically.** The ledger
rule was practised as "nothing enters a MANUSCRIPT until VERIFIED", treating
docstrings as outside the boundary. In this project the docstrings are where the
methodological arguments are actually written, so that boundary was wrong.
`scripts/check_citations.py` now extracts every arXiv ID and author-year
citation from `src/` and `scripts/` and fails if any is absent from the ledger,
and it is wired into `verify.sh`. Tested in both directions: passes on the
current tree, and catches a planted unledgered reference. Recorded as ledger
correction C6.

**Also added to `verify.sh`'s import-surface check.** `CAUTION_K == 2.0` is
pinned so a silent retune cannot change what a reader is told, and
`normalized_beta` is asserted exactly scale-invariant under
`beta -> c*beta, V -> c^2*V`. Both are one-line assertions on properties the
paper depends on and neither existed before.

**Attempted and not completed.** The EU AI Act primary-text retrieval
(Articles 11, 12, 13, 19, 26, 86, Annex III point 5, Annex IV, and the Article
113 application dates). One agent hit an API session limit mid-task and the
other failed to start. **Nothing from that attempt is recorded anywhere**, and
no partial legal text was retained, deliberately: a half-retrieved regulation is
worse than none. Reg (EU) 2024/1689 therefore remains the highest-risk
unverified item, unchanged from 21 August. The application-date question in
particular must be settled before the paper claims the Act applies to agentic
credit underwriting now.

**Unchanged and now seven days overdue.** BFSI pipeline access for Stage 0.

## 2026-08-23, second entry

**The AI Act obligations this paper is about are not in application, and will not
be until 2 December 2027.** Verified from EUR-Lex primary text. This is the
largest single finding since Gate A and it changes paragraph one.

**What happened.** Regulation (EU) 2026/1744, the "Digital Omnibus on AI",
adopted 8 July 2026, published in the OJ on 24 July 2026, in force 27 July 2026,
amended Article 113 of the AI Act. Its Article 1(40) replaces Article 113 third
paragraph point (c) so that Chapter III Sections 1, 2 and 3 apply from **2
December 2027** for Annex III high-risk systems and 2 August 2028 for Annex I.

Articles 11 (technical documentation), 12 (record-keeping) and 13 (transparency)
sit inside Chapter III Section 2, and Annex IV is operative only through Article
11(1). All of them are therefore deferred for a credit underwriting system.
Annex III point 5(b), creditworthiness, is itself unchanged and still captures
the BFSI pipeline.

**The brief is wrong and must be corrected.** `paper-2-agentic-attribution.md`
says "Agentic systems are the 2026 deployment story, the AI Act applies to them
now". False as of today for every provision this paper rests on. The repo
documents never made that claim, which is luck rather than discipline.

**This is a better position, not a worse one.** A conformity specification
published in 2026 for an obligation that bites in December 2027 arrives while it
can still be adopted, which is the entire point of the WS6 deliverable. And
Article 11(1) as amended now obliges the Commission to produce a simplified
Annex IV form for SMEs and SMCs which **does not yet exist**, so the deliverable
has a live target rather than a hypothetical one.

**Recital (40) is the strongest regulatory hook the programme has found, and it
belongs in all three papers.** The legislature's own stated reason for the
deferral, verbatim: "the delayed availability of standards, common
specifications, and alternative guidance and the delayed establishment of
national competent authorities lead to challenges that jeopardise the effective
entry into application of those obligations". The Union is saying on the record
that it could not bring the high-risk regime into application because the
apparatus for demonstrating conformity was not ready. P1 argues interpretability
evidence cannot support a conformity claim; P2 argues observability evidence does
not track causation; recital (40) is the regulator conceding the general point.
Cite as a recital: explanatory, non-binding, never as operative law.

**A trap now recorded in the ledger.** Regulation (EU) 2026/1744 has only four
articles. Recital (40) and Article 1 point (40) both exist and concern the same
subject. There is no "Article 40". The binding amendment is Article 1(40).

**Methodological note that cost nothing and would have cost a lot.** The first
search surfaced a law-firm briefing describing the deferral as a *proposal* with
formal adoption "expected in the coming weeks". It was published 27 May 2026 and
was accurate then. Had it been trusted rather than used only to locate the
instrument, the paper would have recorded a proposed change as unadopted, or the
old dates as current. Every secondary source on AI Act dates is now suspect
unless its publication date is checked against 24 July 2026.

**Written.** `docs/REGULATORY-BASIS.md`, the verbatim primary-text foundation for
WS6, with epistemic markers throughout and an explicit list of what is still not
retrieved. Ledger correction C7. Ledger rows added for 2024/1689 (PARTIALLY
VERIFIED) and 2026/1744 (VERIFIED).

**One load-bearing link needs a second pair of eyes.** That Articles 11, 12 and
13 sit inside Chapter III Section 2 was established by inspecting where the
Section headings fall in the consolidated text, not by direct quotation. The
whole framing depends on it. Flagged in REGULATORY-BASIS section 7 as a
two-minute check to do before the claim enters the manuscript.

**Still not retrieved, all load-bearing for WS6.** Article 12 in full, which is
the single most important provision for the deliverable, plus Articles 11, 13,
19, 26, 86 and Annex IV in full. EUR-Lex HTML truncates on retrieval, so these
need fetching in sections or from the PDF. Next block.

## 2026-08-23, third entry

**WS6 now has its full legal foundation.** Articles 11, 12, 13, 18(1), 19, 26, 86
and Annex IV retrieved complete and verbatim, plus recitals 71 and 171. Written
into `docs/REGULATORY-BASIS.md` sections 8 to 14. Article 12 was verified
character for character against the OJ original.

**Retrieval note worth keeping.** EUR-Lex is behind an AWS WAF challenge that
returns HTTP 202 and zero bytes of legal text to programmatic fetches, which is
why the earlier attempts truncated. The working route is the **Publications
Office Cellar repository**, EUR-Lex's official backing store, which serves the
identical consolidated document at
`https://publications.europa.eu/resource/celex/02024R1689-20260727`. Recorded so
the next session does not rediscover it.

**Four findings, and they are stronger than the original framing.**

1. **Article 12 is system-level and says so.** The unit of obligation is "the
   system", and the three purposes in 12(2) are risk identification, post-market
   monitoring and deployer monitoring. None is attribution of an output to an
   internal cause.

2. **For credit scoring there is no minimum log content at all.** Article 12(3),
   the only enumerated minimum, binds solely Annex III **point 1(a)**, remote
   biometric identification. Creditworthiness is point 5(b) and falls outside it.
   So for the BFSI pipeline the Regulation prescribes no minimum log content
   whatsoever, only that capability exist. Stronger than what the paper claimed.

3. **The Act has no vocabulary for agentic systems.** Across the six units that
   constitute the entire high-risk documentation and record-keeping package,
   "agent", "agentic", "multi-agent", "orchestration" and "reasoning" appear
   **zero times**. "tool" appears once, plural, meaning third-party development
   artefacts. "step" appears once, meaning a step in the **development process**.
   The only internal-component reference is Annex IV 2(c).

4. **The retention asymmetry is a factor of twenty.** Technical documentation is
   kept 10 years (Art. 18(1)); logs are kept 6 months (Arts. 19(1) and 26(6)).
   The static architecture description outlives the dynamic execution record
   twentyfold. If attribution needs the runtime record, the mandated evidence
   expires before litigation or market surveillance would reach it. Both
   retention duties are also limited to logs "to the extent such logs are under
   their control", which writes accountability diffusion into the duty itself.

**The sharpest single point found so far.** Article 86 gives an affected person
the right to "clear and meaningful explanations of the role of the AI system in
the decision-making procedure and the main elements of the decision taken". Two
limbs, and neither covers how the system produced its output. The duty-holder is
the **deployer**, whose evidentiary base is Article 13 instructions plus Article
12 logs, both system-level. **The right terminates at exactly the layer where
causal attribution would have to begin.** That is the paper's thesis stated in
the structure of the Regulation.

**Also relevant to BFSI specifically.** Articles 19(2) and 26(6) second
subparagraph fold a financial institution's AI Act log duty into its existing
financial-services record-keeping, whose granularity was never designed for
causal attribution over an agent trajectory.

**Three reviewer objections identified and answers drafted** in REGULATORY-BASIS
section 13, including one that needs more work: a reviewer may say Article 25
(AI value chain) is where the Act handles multi-component systems. Article 25 and
the Article 3 definitions are **not yet retrieved** and should be before the
manuscript. The answer is that allocating responsibility between actors is not
the same as producing evidence of which component caused an output, but it must
be met explicitly.

**Discipline note.** Two formulations are supported by the text and two are not.
Supported: the obligation is specified at system level, and neither Article 12
nor Annex IV requires records sufficient to attribute an output to a specific
component. Not supported and must not be written: that the Act "prohibits" or
"excludes" component-level logging, or that it "defines traceability as
system-level". The word "traceability" appears once in the entire Article and is
never defined in the Act.

**Still not retrieved:** Articles 25, 72, 74, 79(1) and the Article 3
definitions.

## 2026-08-25

**Blocked on two tool limits, so the day went to unblocked code.** Subagents hit
a weekly limit resetting 29 August, which stopped the Article 25 retrieval before
it produced anything usable. Nothing partial was kept. A direct fetch of the
Cellar URL also failed: it needs specific Accept headers the fetch tool cannot
send. Articles 25, 72, 74, 79(1) and the Article 3 definitions therefore remain
outstanding, and reviewer objection 3 in REGULATORY-BASIS section 13 stays
unanswered until then.

**WS5.3 closed, and it was a pre-registration compliance gap of the same class
as the CAUTION_K one.** PREREG s6 LOCKS two reports: the CR1 cluster-robust OLS
secondary specification, and VIFs. Both estimators existed in `analysis.py` and
were validated in `validate_analysis.py`. **Neither was ever called in
`dry_run.py`.** The locked specification was satisfied in the library and
unsatisfied in the analysis, which is exactly the failure this project already
caught once when the prereg locked a primary contrast that had never been
computed. Now wired into the H2 block: per-covariate VIFs flagged against the
6.11 level coverage was verified to, the CR1 OLS secondary with cluster and naive
standard errors side by side, and an explicit primary-versus-secondary agreement
line implementing the "if they disagree, state it in the abstract" clause.

**Two dishonest output lines caught in my own draft before shipping.** The first
version printed "this is why clustering by decision is not optional here"
directly underneath a measured `se_cluster / se_naive` ratio of **0.99**, a
number that flatly contradicts the sentence. The second printed a |z| of 0.29 for
an intercept that is structurally zero, because `y` is standardised within
decision, making it a ratio of two numerical zeros.

Both are now fixed to report what the numbers say. The clustering block reports
the ratio, states plainly that on this synthetic generator clustering barely
changes anything, and explains why that is a property of the generator rather
than evidence against clustering: this chain draws node covariates independently
and puts no decision-level random intercept into the attributor score, whereas
`validate_analysis.py`, whose generator does carry one, measures cluster coverage
0.95 against naive 0.35. Real traces resemble the second case. That is precisely
why PREREG locks clustering in advance instead of deciding it from a measured
ratio, and the block now says so. The intercept is reported as not identified.

Worth recording as a pattern: both defects were narration asserting a conclusion
the adjacent number did not support. Neither would have been caught by a test,
because the code was correct. They were caught by reading the output.

**Verified on the machine of record**, in an isolated temp directory so
`results/` was untouched: compiles, runs to exit 0, VIFs 1.04/1.07/1.05 all well
under 6.11, secondary rejects on verbosity at |z| = 16.68, primary and secondary
agree. Six new keys added to the `h2` block of `results/dry_run.json`.

**Tooling note.** The cloud sandbox's shell was unavailable for most of this
session (safety-classifier timeouts), so the candidate was tested through the
device bridge instead, in a scratch copy rather than the repo. The bridge cannot
delete files, so the scratch script was moved to `_to_delete/`, now gitignored
along with `_scratch_*`.

**Unchanged and now nine days overdue.** BFSI pipeline access.

## 2026-08-25, second entry

**WS1.7 closed, and it found a real defect in a pre-registered statistic.**

The task was "estimators correct where Y is not in {0,1}". The estimators are
correct. What is not correct is the quantity H4 ranks on.

**The defect.** `ME = TE_crn - DE` is an identity, not a split into non-negative
parts. H4 is a rank correlation on `mediated_share = |ME| / |TE_crn|`, and that
is a share only where `DE` and `TE_crn` point the same way. Where they oppose,
`|ME| = |TE - DE| > |TE|` and the ratio exceeds 1. Every SCM in the repo before
today had both paths pushing the same way, so the case had never been exercised.

It is not exotic. It is suppression, and it has a plain reading in an agent
pipeline: a retrieval that directly supports approval while causing a later
verification step to raise a flag.

**Derived by hand first, then measured.** On `y = w*a1 - (1-w)*a3` with w = 0.2,
q = 0.9: `TE_crn(1) = +0.30`, `DE(1) = -0.10`, `ME(1) = +0.40`, share = 4/3
exactly. Measured: `+0.3003`, `-0.1001`, `+0.4004`, share `1.3333`. All four
steps within Monte Carlo error, decomposition identity residual `5.55e-17`. The
estimators are right; the ratio on top of them is not.

**Why it matters for H4 specifically.** A pure mediator has `DE = 0` and scores
exactly 1.0, the maximum the quantity is meant to reach. A suppressed node scores
1.33 and outranks it. The raw ratio is unbounded above and grows as `|DE|` grows
in the opposing direction, so ranking on it puts suppression above pure mediation
and mixes two opposite mechanisms into one score.

**The fix, and why not a clamp.** `effects.mediated_share` forms a share only
where `sign(DE) == sign(TE_crn)` and `|DE| <= |TE_crn|`, returning NaN and a
suppressed flag otherwise. `ranking.h4_statistic` now returns
`(taus, n_dropped, n_total)` so H4 cannot be reported without its exclusion rate.
Clamping 1.33 to 1.0 would be the repair PREREG s4 forbids, and it would silently
merge suppression into pure mediation, which is the confusion the rule exists to
prevent. LOCKED in PREREG s2, derived in DERIVATIONS Part VI.

**A previously reported number was wrong, and this is the part worth flagging.**
The fix moved dry-run H4 from `tau_b = +0.698` to `+0.855`, with 80/240 nodes
(33.3%) now excluded, all inert, none suppressed. The old code assigned inert
nodes a share of **0.0**, which asserts their influence is entirely direct when
they have no influence at all. **A third of the nodes entering the previously
reported H4 carried a fabricated share.** Synthetic, so no live claim moves, but
the statistic would have met real traces in that state, where inert nodes and
opposing paths are both expected rather than exotic.

**Caught a call-site break before it shipped.** Changing `h4_statistic`'s return
to a tuple would have silently broken `validate_primary.py:122`, which unpacked a
bare array. Fixed, and given an assertion that the planted H4 design has zero
exclusions, so a future change to the generator or to `mediated_share` fails
loudly instead of quietly altering H4's population.

**Verified.** Eight edge cases on `mediated_share` (ordinary, pure mediator, pure
direct, both suppression forms, inert, the `|DE| == |TE|` boundary, vectorised),
`scripts/validate_suppression.py` added to `verify.sh`, full suite ALL GREEN with
eight validators.

**Pattern worth naming, third instance.** CAUTION_K claimed a pre-registration
that did not exist. WS5.3 had two LOCKED reports the chain never produced. This
one had a pre-registered statistic whose definition broke outside the regime
every existing test happened to sit in. In all three the code was correct and the
specification was not met. Tests do not catch this class; only reading the
specification against the analysis does.

**Unchanged and now eleven days overdue.** BFSI pipeline access.

## 2026-09-03

**Programme audit, requested by Ajay, and it found drift that neither of us had
named.** Today is 3 September. The August sprint's own arXiv date was 31 August
and passed three days ago with no manuscript in existence: the repository had no
`paper/`, no `configs/` and no `analysis/` directory. Two sessions ran past that
date without raising it.

**The shape of the drift.** Sprint days D1 to D4 and D8 executed close to plan.
From D5, 17 August, every remaining day required BFSI pipeline access that never
arrived. Work continued, and the work was real: estimator core, coupling theory,
mediation layer, statistics, pre-registration, citation sweep, verified EU AI Act
foundation, `verify.sh` green across eight validators. But all of it was the
unblocked residue rather than the critical path. For fourteen days the work
optimised what was reachable instead of confronting what was blocking. The brief
had anticipated exactly this and said the fallback must be invoked on a date and
not arrived at by drift. It was arrived at by drift.

**Two protocols we agreed and dropped.** `docs/DAILY.md` was made binding by
AUGUST-SPRINT s7, one entry per day; its last entry was D8 on 20 August, and the
D5 to D8 entry is itself marked "reconstructed from git log", which is the
failure the protocol existed to prevent. `RESEARCH_LOG.md` went nine days
unlogged. Both are mine and I raised neither.

**FALLBACK INVOKED, by Ajay, today.** Recorded in `preregistration/PREREG.md`
under a dated heading. PREREG s7 clause two is in force.

**The consequence is scope, not wording, and it is the part worth recording.**
H1 to H4 are hypotheses about a real observability record against real causal
effect. They are not testable without the live arm. Both abstracts drafted in
PREREG s8 open "We run it on a live regulated credit underwriting system" and
neither survives. So this is not a weaker version of the same paper; it is a
different paper, methods and theory and specification, publishing a
pre-registered experiment it does not run.

**The dry run was not promoted to a result, and the temptation to do it was
real.** `results/dry_run.json` carries `SYNTHETIC_NOT_RESULTS: true` and every
generator behind it is planted, so `tau_b = +0.855` is known by construction.
Reporting it as a finding would be circular and a reviewer would say so in one
line. A gate in this session's script asserts the guard flag is still present.

**What ships instead**, all built and validated already: the `TE_marg` versus
`TE_crn` distinction, the direct effect and decomposition identity, the coupling
construction and its measured degradation, the suppression result, the verified
regulatory basis including the deferral, and the Annex IV specification. A third
abstract was drafted and committed before any further writing, per rule 6.

**Two stale status documents corrected.** `docs/TODO.md` 0.11 and 6.1, and the
ledger row for Reg (EU) 2024/1689, all still read "not retrieved" for provisions
that were retrieved verbatim on 25 August. Same failure class as a locked
specification the analysis never satisfies, pointing the other way.

**Three missing convention directories created**, with the reason `configs/` is
empty written down rather than left to look like an omission.

**Next.** WS1.9 pytest and CI, then the remaining reachable workstream items,
then the manuscript. Target: P2 complete this week.

## 2026-09-04

**WS1.9 closed. `pytest` green from a clean checkout, 85 tests, wired into
`verify.sh` and into CI.** This was the last unblocked code item in the
repository.

**The part that is not coverage.** `tests/test_contracts.py` tests the direction
a unit test cannot. Four times this project has caught a defect in which the code
was correct and the specification was not met: CAUTION_K claiming a
pre-registration that did not exist; PREREG s6 locking two reports that lived in
`analysis.py`, were validated, and were never called by `dry_run.py`; a
pre-registered statistic that broke outside the regime its tests occupied; and
status documents asserting provisions were unretrieved nine days after they were
retrieved. No numeric validator catches that class, because nothing is wrong with
the numbers. The contract tests parse `dry_run.py` with `ast` and assert that
every LOCKED estimator is actually called, that every `validate_*.py` on disk is
wired into `verify.sh`, that the citation gate is present, that every results
file carries an env block, and that the fallback invocation is in the
pre-registration with its date.

**Two real defects the suite found while it was being written.**

First, `verify.sh` would have called bare `pytest`. A bare console script
resolves to whichever interpreter installed it, which need not be the `python3`
running the validators. It produced "No module named numpy" from a suite that
passes under `python3 -m pytest`. Now pinned to the same interpreter as
everything else in the file.

Second, and this is the better one: `validate_mediation.py` contains a comment
arguing that env fields must be recorded uniformly, because a fingerprint that
omits a field on some files cannot answer "same environment?", since an audit
reads an absent field as a third environment rather than as "not applicable".
The file then omits `seed`. It argued the principle and did not apply it to
itself. Now records `seed: None`, which is the true statement for a module that
draws no randomness. This moves that file's `env_hash` and no scientific number;
a gate in this session asserts exactly that, checking that `unsafe_executions`
is still 0 and that no other results file moved.

**One precondition pinned rather than left latent.** `analysis.vif` regresses
column j on the others without an intercept while scaling by a mean-centred total
sum of squares, so the ratio is a standard VIF only when the input columns are
already centred. `dry_run.py` satisfies this by z-scoring within decision. On
uncentred orthogonal indicators the same call returns 0.75, which is not a
variance inflation factor and would read as reassuring. The function is unchanged,
because on the data it is actually given it is correct and changing it would move
a committed number for no gain. The precondition is now a test, and a second test
asserts the analysis still standardises.

**Verified green three ways:** in place, from a clean `git archive` tree, and
from a subdirectory. `verify.sh` now prints ten lines.

**Next.** The manuscript. Sections 3 to 6 are written from `DERIVATIONS.md` and
are the parts that already exist in full.

**A defect in the shipping script, recorded because it is the same class.** The first
run of `ws19_session.sh` aborted, and its gates were wrong while the tests were
right. GATE 4 ran `pytest` immediately after patching `validate_mediation.py`
but BEFORE re-running it, so `results/validation_mediation.json` still held the
pre-patch env block with no `seed` key. The contract test reported that a
results file lacked a seed, which was true. GATE 6 then ran `verify.sh`, which
re-ran the validator, regenerated the artifact, and passed 85/85 in the same
transcript: `env_hash f0e8cb10e8d82826` at GATE 4, `f407d037b90aefde` at GATE 6.

The correct order is patch, then regenerate the artifacts the patch affects,
then test. The script tested first. A second flaw was found while fixing it: the
clean-checkout gate built its tree from `git archive HEAD`, which is the old
commit plus the new files, so it would have failed on the stale artifact even
after a correct regeneration. A clean-checkout check has to be built from what
is about to be committed, and it now archives the staged tree.

Worth naming because it is the third defect this week from the gap between where
something was tested and where it runs, after the zsh `#` comment producing five
junk files and `git log | grep -q` returning 141 under `pipefail` on the machine
of record while passing in the sandbox. The tests were not at fault in any of
the three. The harness around them was.

## 2026-09-04, second entry

**Manuscript started, and a novelty sweep found that its sharpest section was
claiming a known result.**

Sections 3 to 6 were written from `docs/DERIVATIONS.md`. Then the sweep that
should have run first ran, and section 6 did not survive it intact.

**The finding.** Section 6 presented as a result that `|ME|/|TE|` exceeds 1 when
the direct and mediated paths oppose. In mediation analysis that ratio is the
proportion mediated, the configuration is called **inconsistent mediation**, and
its instability is established in MacKinnon, Warsi and Dwyer (1995),
*Multivariate Behavioral Research* 30(1):41-62. Kenny's mediation resource states
verbatim that the measure "can be greater than one or even negative". A reviewer
who knows this literature rejects the claim in a line.

Both primary references were verified against four independent records each
before being written into the bibliography.

**What survives, and it is a better paper for the correction.** The inequality is
attributed. What stays ours is that a **pre-registered statistic in this project
ranked on a quantity the literature says not to compute when the denominator is
small**; that inconsistent mediation has a concrete reading in an agent pipeline,
namely a retrieval that supports approval while causing a later verification step
to flag; and that the response is exclusion with a mandatory reported rate rather
than a clamp. The framing is now that agent-attribution work has been built
without reference to fifty years of mediation methodology, and importing it
correctly is the contribution.

**Two further claims caught before they were written.** Common random numbers is
standard variance reduction (Law and Kelton) and the maximal-coupling bound
`1 - TV` is classical (Levin, Peres and Wilmer). Neither is claimed now; both are
cited. arXiv 2605.04732 uses CRN for rollout-based planning and was checked and
**cleared**: no coupling agreement probability, no quantile-versus-maximal
comparison, no attribution or mediation. It is cited as adjacent work.

The one thing left as ours in section 5 is the closed form for shared-`u`
quantile-coupling agreement and the measured gap, and it is stated with "we have
not found it stated for this purpose" rather than as a novelty claim, because a
search returning nothing is not proof of absence.

**Process failure worth recording.** The rule is "before any novelty claim,
search". The draft existed for a day before the search ran. Search before
drafting, not before submitting.

**IASEAI'27 policy, verified from the '26 documents and NOT yet from the '27
call:** double-anonymous review; preprints allowed before or during review but
"must not be linked or mentioned in the submission", so an arXiv post does not
conflict; 10 pages main text excluding references; mandatory template; archival
track requires at least 50% new technical content. **The '27 dates could not be
retrieved: the page is JavaScript-rendered and returns none.**

**Next.** Section 8 as an appendix from `REGULATORY-BASIS.md`, section 7 from the
pre-registration, then 1, 2, 9, 10, figures, and a red team.

## 2026-09-04, third entry

**The load-bearing legal link is no longer a reading.** `REGULATORY-BASIS.md` s7
step 2, the claim that Articles 11 to 13 sit inside Chapter III Section 2, was
marked STRUCTURAL and the whole deferral framing rested on it. Read off the
primary text today: Section 1 is classification and covers Articles 6 and 7,
**Section 2 is "Requirements for high-risk AI systems" and covers Articles 8 to
15**, Section 3 is obligations of providers and deployers and covers 16 to 26.
Articles 11, 12 and 13 are in Section 2. One weak inference remains and is marked
as such: that the OJ original carries the same Section structure as the
consolidated text, which follows from the scope of the amending act.

**Article 25 retrieved, and it strengthens the paper rather than threatening
it.** Reviewer objection 3 was that Article 25 is where the Act handles
multi-component systems, so Article 12 is the wrong provision to build on. With
the text in hand the objection answers itself. Article 25 allocates the legal
role of provider between actors and imposes duties of cooperation, documentation
"sufficient to assess compliance with the requirements laid down in Article 16",
information about "known limitations and failure modes", and targeted technical
access. Every obligation is about who is answerable and about enabling
compliance. None is about evidence of which component caused an output. The two
provisions do different work and the paper needs both.

**Article 3 definitions retrieved**, and (1) "AI system" is singular and
system-level throughout, so a pipeline of five tool-backed services and a model
is one AI system with one provider and one deployer. The Act has no vocabulary
for the internal components this paper measures, and that is now supported by
the definition itself rather than by its absence elsewhere.

**Still not retrieved: Articles 72, 74(1) and 79(1).** Every route tried today is
recorded in the new s18 with its outcome, so the next attempt starts from the
failures. The only route that returns article text truncates mid Article 26,
which is why 25 came back and 72 did not. Until they are read, section 8 must not
characterise what Article 12(2)'s cross-references require.

**IASEAI'27 dates, provided by Ajay from the official programme page.** Main
conference **9 to 10 February 2027**, workshop days 11 to 12 February, UNESCO
House, Paris. Submission portal **opens 18 September 2026**; **paper, workshop and
model-policy proposals close 2 October 2026**; reviews shared 2 November; optional
author responses 4 November; decisions 6 November. Talk proposals and statements
of interest remain open on a rolling basis to 9 and 15 January 2027.

**That is 28 days, not seven.** The arXiv date next week is Ajay's own choice and
stands, but the conference deadline is 2 October, which leaves roughly three weeks
after the preprint for the anonymised, template-formatted, 10-page version. The
plan should stop treating the two as one deadline.

**A gate defect fixed rather than carried.** In the previous session GATE 5 ran
pytest, printed nothing at all, and passed. A gate that reports success without
producing evidence is worse than no gate. It now requires a summary line matching
a test count and fails closed if there is none.

## 2026-09-04, fourth entry

**The draft is complete.** Sections 1, 2, 7, 8, 9 and 10 written, plus Appendix A,
the traceability specification. Zero stubs. 17 pages: 11 main text, 2 references,
4 appendix. Every citation resolves in both directions and every arXiv id in the
bibliography is ledger-backed.

**The appendix is derived, not proposed, and that is the design decision worth
recording.** Twelve requirements, each of which is a precondition for one of this
paper's own estimands to be computable from a filed record. Nothing is in it
because it sounded prudent. Four conformance levels, and the one that matters is
L1 to L2: L1, a reconstructable trajectory, is what observability stacks already
deliver; L2, counterfactual replayability, is what causal attribution requires,
and no provision of the Regulation asks for it. R5, the keyed-randomness
requirement, is singled out as free at design time and impossible to add
afterwards.

**Section 8 makes the argument the retrievals earned.** Description versus record
and general versus per-instance; the logging duty bounded above by two
system-level purposes now that Articles 72 and 79(1) have been read; no minimum
log content at all for Annex III point 5; the factor-of-twenty retention
asymmetry with neither actor obliged to hold the whole trace; Article 74's
escalation ladder reaching source code without ever reaching an execution trace;
and Article 79(6)(b) offering one whole system against one whole Section as the
finest granularity available. Then the two Commission instruments that do not yet
exist, one of which has a deadline of 2 September 2027.

**The introduction positions against CAR in paragraph one**, as the brief
required, and uses the concessions in that work's own text: a marginal total
effect, the direct effect left as a refinement, and mocked tools.

**Page budget, stated now rather than discovered later.** Main text is 11 pages
against IASEAI's 10-page limit. arXiv has no limit, so this binds only the
conference version, and the trim is a bounded named task.

**Still to do before arXiv:** figures, of which the paper currently has none; a
red team in a fresh session per standing rule 7; the final ledger pass; and the
anonymised, template-formatted variant for 2 October.

## 2026-09-05

**P1 is on arXiv and has been since 13 August.** Verified against the listing:
arXiv 2608.13754, *Explanation Multiplicity*, Ajay Pravin Mahale, Hochschule
Trier, v1, cs.AI. It shipped 28 days ahead of its own 10 September target. The
audit of 3 September recorded P1 as unknown and the decisions of 4 September
slipped it to 20 September. Both were wrong, and wrong because this chat asked a
question instead of opening a folder that sat one level above one already
connected. Recorded because it is the same failure this project has been
cataloguing all week, committed by me.

**P2 now cites P1 twice**, which is the cross-citation the brief said makes these
a programme rather than two unrelated papers: at the ablation-operator argument,
where the circuit-level finding that a filed claim flips across 73.2% of
specification pairs is the same class of analytic choice one level down; and in
the introduction, framing them as one argument at two levels of abstraction, with
the note that the two failures are independent because evidence could be
perfectly stable and still track the wrong thing.

**Full pre-arXiv citation sweep under the citation-verify standard**, which holds
that a prior verified row does not carry over and VERIFIED means fetched this
session with every field confirmed. Fourteen arXiv identifiers, twelve confirmed,
**four discrepancies, two not re-verifiable**.

The one that mattered: **2606.04990's author order was wrong**, in the
bibliography and in this ledger. Zhangkai Wu sat in position 3 and belongs in
position 7, after Zequn Sun. It had survived three weeks and two earlier sweeps,
because every earlier check confirmed that the paper existed rather than that our
transcription of it was right. That is a different question and only the second
one protects a bibliography.

Two discrepancies were things we did not have rather than things we had wrong,
and both strengthen the citations: AttriGuard is **"Accepted by USENIX Security
2026"** and Yadav et al. carries a **Reinforcement Learning Journal** reference.
Both were being cited as bare preprints.

One is now **DISPUTED**: Who&When's "PMLR v267, pp. 76583-76599". PMLR v267 is
confirmed to be ICML 2025, but the paper was not locatable in the index this
session and arXiv's Comments field says only "camera-ready". The page range is
marked pending re-confirmation in `refs.bib`.

**Two entries could not be re-verified and are named rather than assumed.**
2606.09692 and 2605.09168 both return no machine-readable text to the fetch tool,
attempted twice each. Both carry August VERIFIED rows with URLs. Per the rule, a
blocked fetch is not routed around and the state is not upgraded, so **this
bibliography must not be described as fully checked** until someone opens those
two abstract pages in a browser. Two minutes.

**A humanizer pass found nothing, and nothing was invented to look busy.** Zero
hits across AI vocabulary, copula avoidance, superficial participial phrases,
negative parallelism, filler, hedging stacks, em dashes and curly quotes. All
eleven three-item lists are real enumerations: step types, hypothesis labels, a
verbatim quote from Article 74. The prose was written under the standing rules
that already ban em-dashes and hedging, so those patterns were never introduced.

**A Unicode audit found the sources are pure ASCII**, with no invisible or
provenance-marking characters in `main.tex`, `refs.bib` or the `Makefile`.

**A BibTeX lesson worth keeping.** The first attempt at these corrections put
explanatory `%` comments inside the entries. BibTeX has no in-entry comment
syntax and skipped every entry that followed one, silently dropping 46 citations.
Comments belong between entries, where BibTeX ignores them. A gate now fails on
any `%` inside an entry.

## 2026-09-05, second entry

**Two figures, and the paper had none.**

Figure 1 puts the two estimands side by side on the same four planted steps, with
hatching for the steps that have no path to the outcome. The left panel shows the
inert step matching the decisive one in length; the right shows both inert steps
at exactly zero. That is the paper's first substantive claim and it was only a
table before.

Figure 2 plots agreement against divergence with closed forms as lines and
measurements as markers, so their agreement is shown rather than asserted, and
marks the factor of nine that a probability-sorted sampler costs at
`TV = 0.18`. The coupling table moved to the appendix: it carried the same six
rows, the figure shows the shape, and the table holds the exact values needed to
check the 1.9-sigma claim. Main text stayed at 12 pages despite gaining two
figures.

**The figures caught three things that were not on the plan.**

**Type 3 fonts.** matplotlib defaults to Type 3 in PDF output. Several venues
reject Type 3 outright, it does not scale, and it is not text-searchable. The
manuscript body is Type 1 Latin Modern, so the figures would have been the only
non-conforming part of a submission. Now Type 42 in Computer Modern, which also
makes the figure type match the body rather than sitting beside it in a different
face. Verified with `pdffonts`: 0 Type 3 and 0 unembedded fonts across the whole
document.

**My own font check was wrong in the opposite direction.** A byte-count for
`/FontFile` reported "fonts=0", implying nothing was embedded, when everything
was. `/FontFile` is not the marker for Type 3. Counting byte patterns in a binary
format is not inspecting it, and the reflex to grep a file rather than parse it
has now produced four defects in this project.

**Three annotation placements collided before the fourth worked**, and the fourth
was to stop annotating inside the plot and let the caption carry the sentence.
Each failed placement is recorded in `make_figures.py` so nobody re-tries them.

**Greyscale legibility was computed, not eyeballed**, as relative luminance
between the three series inks and against the paper. The first pass checked only
series against each other and missed the background comparison, which is what
told me the lightest ink needed darkening from `#B0B0B0` to `#949494`. Every
series also carries a distinct linestyle and marker, so identity never rests on
tone alone.

---

## 2026-09-05  Red team, and what it cost

Two adversarial reviews of `paper/main.tex`, run in fresh sessions with no
context about authorship or effort, one on methods and one on the regulatory
analysis. **Both returned "Reject."** Both named a single fatal objection. Both
objections were verified before anything was changed, and both are upheld.

### What was verified before acting

**Methods, objection 1c.** Claim: under eq:scm with `q = 0.9`, `w = 0.5`, on the
factual draws where `u_3 >= q`, the DECISIVE retrieval's `TE_crn` is exactly
zero, so an exact zero cannot mean inertness. Checked against the committed SCM
and the committed estimator in `scripts/validate_crn_degeneracy.py`:

- `P(u_3 >= q)` over 20000 factual draws: **0.0974**, nominal 0.10.
- On the 300 seeds the estimator was run on the event occurred 18 times
  (rate 0.060, two-sided binomial p = 0.020 against 0.10, an unlucky seed set;
  reported, not reseeded). On **all 18**, `|TE_crn(1)| < 1e-12`, while
  `|DE(1)| = 0.254 +/- 0.014`. The step acts and reads zero.
- Sweeping `w`: exact-zero rate 0.133 at `w = 1/2` and **exactly 0** at 0.2,
  0.3, 0.4, 0.6, 0.8. The cancellation needs `w = 1 - w`.

Objection UPHELD.

**A second result found while checking the first**, which goes the other way:
`TE_marg(0) = TE_marg(1)` and `TE_marg(2) = TE_marg(3)` **identically on every
factual draw** (max difference 0.000e+00 over 30 draws), with closed forms that
match to within 4 standard errors. The marginal estimand's inability to separate
an inert step from a decisive one is an algebraic identity on this chain, not a
coincidence at the run we reported. That STRENGTHENS the paper.

**A third, also from the same reviewer.** The pin plausibility the paper
reported is `(q + 1 - q)/2 = 1/2` for EVERY `q`, so it carried no information.
Measured: pooled 0.483 at `q = 0.9` against 0.899 on the unchanged arm and 0.097
on the changed arm; at `q = 0.99`, 0.482 against 0.990 and 0.010. The changed arm
is the number that matters. Objection UPHELD.

**Regulatory.** Claim: Article 86 confers a per-instance right, sits in Chapter
IX so is not deferred, is recorded VERBATIM in our own `docs/REGULATORY-BASIS.md`
section 11, and appears ZERO times in `main.tex`. Confirmed by grep: zero
occurrences. Objection UPHELD. Article 21(2) and Article 73(6) retrieved; the
manuscript's sentence "Execution traces appear on neither rung" is WRONG and is
retracted in the paper's own words.

### What was decided

**`W_DIRECT` is not changed.** Moving `w` off 1/2 removes the degeneracy and it
would be the repair PREREG s4 forbids. `w = 1/2` is kept BECAUSE it is the worst
case for our own estimand. The degeneracy is now in the abstract, in
Proposition 2, and in Limitations.

**The claim is narrowed to one direction.** An inert step returns exactly zero
under CRN on every run. A step returning exactly zero under CRN is not thereby
inert. Requirement R5 is now motivated by this: the record must carry the
factual noise so the two cases behind a zero can be told apart.

### What this says about the process

The red team was run because standing rule 7 requires it, and it returned work
rather than clearance. Three things are worth writing down.

1. **The regulatory objection was a filing failure, not a research failure.**
   Article 86 was retrieved, analysed correctly, and called "the sharpest point
   in the whole regulatory analysis" in our own notes three weeks ago. It then
   did not reach the manuscript. Nothing in the process checks that the
   strongest thing in the notes is in the paper.
2. **The methods objection was reachable by anyone who ran the estimator on more
   than one seed.** We reported one factual run because the closed forms were
   derived for one factual run. Standing rule 5 says report variance, not point
   estimates, and it was not applied to the choice of factual draw itself.
3. Both were found by a reader with no investment in the result. That is the
   argument for running the red team before the celebration, not after it.

### Still open

- Two arXiv abstract pages, `2606.09692` and `2605.09168`. Two minutes. The
  bibliography must not be described as fully checked until then.
- Articles 86 and 73(6) against the OJ PDF; currently `VERIFIED-SECONDARY`.
- Gate D sign-off, open since 20 August.
- Main text is 20 pages including bibliography and appendix; IASEAI wants 10 of
  main text. Trim not started.

---

## 2026-09-05, second pass. Triage closed, ledger closed, page budget deferred on purpose

### The four open objections, each settled against the code

`scripts/validate_triage_closeout.py`. All checks pass.

**A. "The point-of-commitment rule from car2026 is never implemented, so
contribution 1 is untested." PARTLY UPHELD.** The rule is implemented
(`effects.point_of_commitment`) and is exercised (`validate_estimators.py`
prints it), so "never implemented" is wrong. But it was printed and never
compared, and contribution 1 claimed a separation from it. Measured over 60
factual draws on the planted chain: **CAR's locus returns the executing step 3
on 60 of 60; largest |TE_crn| returns the retrieval step 1 on 52 of 60; they
disagree on 52 of 60.**

The right reading is not that CAR is wrong. The two rules answer different
questions, a point-of-commitment rule asking where the outcome became
inevitable and a CRN total effect asking whose action carried the difference,
and on this chain those are different components on seven runs in eight. The
paper now says that, in a new subsection, and contribution 1 says it too. This
is a better contribution than the one it replaces.

**B. "Coupling agreement indexed by TV alone hides a factor of 45." UPHELD, and
the true factor is larger.** Held at TV = 0.18 across V in {32, 1e3, 3.2e4, 1e5}
and source entropy s in {0.5, 1.5, 3.0}, all closed form:

- maximal coupling: 0.820 in all twelve cells, because it is 1 - TV by
  construction,
- quantile: 0.631 down to 0.0044, a factor of **142**,
- probability-sorted: 0.774 down to 0.0000.

**Two further findings the objection did not contain.**

1. **The paper's requirement to fix the vocabulary order is stated backwards.**
   Probability sorting is not uniformly worse than a fixed index order. In 1 of
   12 cells it is better, 0.774 against 0.631 at V = 32 with a peaked source,
   and the reversal survives 40000 Monte Carlo draws through the sampler
   (0.7726 vs 0.6323, both within 0.6 sigma of their closed forms). The defect
   in sorting is that the ordering becomes a function of the branch's own
   distribution, not that it is worse. The requirement is restated and the
   reasoning behind it withdrawn in the paper's own words.
2. **The magnitudes do not survive a change of perturbation model either.** At
   the same V = 32 and the same TV, the committed validator's construction gives
   quantile 0.412 and sorted 0.086; bisecting a scale on a fixed noise vector
   gives 0.595 and 0.321. A factor of 3.7 on the number Figure 2 quotes, from
   the choice of how to perturb alone.

   The reconstruction of the committed construction reproduces its Appendix B
   row exactly (TV 0.1788, quantile 0.4121, sorted 0.0860 against the table's
   0.1788 / 0.4121 / 0.0858), so this is a real difference and not a coding
   error.

Net effect on the paper: the case for maximal coupling gets *stronger*, because
it is the only invariant quantity in the section and the alternatives collapse
at a production vocabulary. The quoted numbers are demoted to illustrations.

**C. "g = beta/||beta|| is guaranteed near +/-1 exactly when H1 is true."
REFUTED.** H1 drives the causal coefficient toward zero. That says nothing about
whether any other component reaches the pole, and with K = 3 covariates and two
live ones the largest |g_j| is 0.707, not 1. The pole needs a single covariate
to carry the whole vector, which is neither H1 nor H2. The actual dry-run fit
sits at 0.968, which is high but is driven by verbosity dominating, not by H1.
What survives of the objection was already known before the red team: the
delta-method interval under-covers near the pole, which is why
`bootstrap_normalized_beta` exists and is what the paper reports.

**D. "At q = 1 every deterministic step gets zero effect." UPHELD, and it
generalises Proposition 2.** `do_resample` redraws from the unchanged policy.
Where the policy is a point mass the redraw returns the factual action every
time, the change rate is exactly 0, and TE_marg, TE_crn and DE are all exactly
0 however decisive the step is. Measured at q = 1: step 3 change rate 0.0000,
all three effects 0.0000, while step 1 is untouched at 0.505. Attribution by
resampling is defined only where the policy still has entropy at that step. The
paper now says a zero effect must be read next to its change rate, and that a
zero effect at a zero change rate is the absence of a measurement rather than a
measurement of no influence.

### Citation ledger: closed, with one correction

Both outstanding arXiv entries read against their records. 2606.09692 needed no
correction. 2605.09168 was missing its primary class and carried the note "The
Tesseract Academy", **which appears nowhere on the arXiv record**. An unsourced
field in a bibliography whose whole discipline is that fields come from the
source. Replaced with the Comments field, which is on the record.

Articles 86 and 73(6) upgraded from VERIFIED-SECONDARY to primary, read from the
original OJ text at CELEX:32024R1689, with no discrepancy against either
secondary read. The technique that finally worked, after three truncated
attempts, is to request the document's own `art_86` / `art_73` elements instead
of the whole document. That should be the first thing tried on EUR-Lex, not the
fourth.

Reading Article 73 whole rather than only the paragraph the reviewer named found
**73(2) and 73(4)**: the reporting clock starts when the provider "has
established a **causal link**", and for a death on a "**causal relationship**"
with suspicion sufficient. Three paragraphs of one in-force Article turn on a
causal finding, inside 15 days, about a system the Act never says what record to
keep for. That is now Part V section 22 of the regulatory basis.

### Page budget: measured, and deliberately not acted on

**The 10-page limit is not verified and may not exist.** Checked on 5 September:
the IASEAI'27 conference page publishes themes, dates and participation types
and **states no page limit**; the '27 FAQ has no submission-format section at
all; the archived IASEAI'26 Call for Papers states none either and defers to a
separate "Paper Submission Guide" that is not linked from it. Trimming a
manuscript to a number nobody has published is work that could be wrong in
either direction, so it is not being done yet.

Measured instead, from `main.aux` after the build:

| section | starts p |
|---|---|
| 1 Introduction | 1 |
| 2 Setting and estimands | 3 |
| 3 Two total effects | 3 |
| 4 Direct effect | 6 |
| 5 Coupling | 7 |
| 6 Inconsistent mediation | 9 |
| 7 Pre-registered experiment | 11 |
| 8 What the Act requires | 13 |
| 9 Limitations | 15 |
| 10 Related work | 17 |
| Appendix A | 19 |
| Appendix B | 21 |

Main text is **about 17 pages**, up from 15, because this week's honesty cost
two pages. Total 22.

If a 10-page limit does turn out to apply, the trim is roughly: proofs of
Propositions 1 to 3 to an appendix (0.75p), Section 7 reduced to a half-page
pointer to the published pre-registration (1.5p), Section 6 halved (1p),
Section 8's block quotations to an appendix (0.75p), Section 5's numeric ranges
to a table in Appendix B (0.75p), Section 10 tightened (0.5p), Section 3's
validator numbers to Appendix B (0.75p). That is about 6 pages, which is enough,
and none of it removes a claim. **Do not start it before the submission guide
publishes on 18 September.**

### What did get built for the submission, because it is verified

IASEAI'26 required **anonymised submissions under double-blind review**. That is
a published fact about the prior year, and near-certain to hold. The manuscript
now builds both variants **from one source**, so there is nothing to
re-synchronise later:

    latexmk -pdf main.tex                                    # the arXiv version
    latexmk -pdf -jobname=anon \
      -pdflatex='pdflatex %O "\def\anon{}\input{%S}"' main.tex   # double-blind

The anonymous build blanks the author line and rewrites the one self-identifying
sentence in the body ("A companion study by the same author asks" becomes "Prior
work asks"). The author's name then survives in exactly one place, bibliography
entry [16], which is the ordinary third-person citation of one's own published
prior work and is accepted at most double-blind venues. **Confirm that against
the '27 submission guide**; a minority of venues require it to be cited as
anonymous instead. `GATE 5` fails the build if the name appears anywhere in the
anonymous PDF before the References heading.

### On the critical path, and not a writing task

**Every author needs an OpenReview account before 18 September**, because the
call states verification can take up to two weeks and the portal opens that day.
That is a lead-time item with no slack and it is the only one.

Corrected dates from the call, which differ from what the plan assumed: the
portal **opens** 18 September and paper proposals **close 2 October 2026**.
Reviews 2 November, decisions 6 November, conference 9 to 12 February 2027 at
UNESCO House. The arXiv posting next week is therefore comfortably ahead of the
submission window rather than racing it.

---

## 2026-09-05, third pass. One real defect in the manuscript, and one I invented

### The real one

`paper/main.tex`, Appendix B, the probability-sorted entry at logit shift 2.00
read **0.0446**. `results/validation_coupling.json` says **0.165525**. The wrong
value is a transcription of the 0.0447 on the row above it. Checked cell by cell
against the artifact on the machine of record: **1 mismatch in 42 cells.**

It had been there since the table was written. It survived a full citation
sweep, a figure pass, two adversarial reviews and four readings, because a
transcribed table is not something a reader re-checks digit by digit.

It also carries content. The sorted column is **not monotone** in the
divergence: 0.0447 at TV = 0.3969, rising to 0.1655 at TV = 0.4245. That is the
same mechanism as the ordering reversal in section 5, sitting in our own
committed data and not noticed until a machine compared the two.

`scripts/audit_paper_numbers.py` now derives all 42 cells of that table, all 16
of Table 1, and the section 6 worked instance from their artifacts, and fails
when the manuscript disagrees. It reports its own coverage rather than implying
it: 48 of the manuscript's 99 distinct decimal literals are pinned to an
artifact and the other 51 are listed by name. Wired into `verify.sh`, into
`make -C paper audit`, and into CI.

### The one I invented, and how

Earlier today this session reported, in some detail, that
`scripts/validate_primary.py` had raised `AttributeError` on every run since
commit `988ed58`, that `verify.sh` could not reach `ALL GREEN`, and that
`results/validation_primary.json` was older than the code producing it.

**All of that is false.** `validate_primary.py` unpacks `h4_statistic`'s
three-tuple correctly and has done since `988ed58`, the same commit that changed
the signature, which also added an assertion that the discard rate is zero on
the planted design. Run on the machine of record: *All primary-contrast checks
passed in 111s.*

The cause. The analysis was run against a copy of the repository staged into the
cloud session on **20 August**, sixteen days stale, predating `988ed58`. The
"confirmation that the defect was pre-existing" was run against that same stale
directory, so it confirmed nothing except that the stale file was stale. Three
separate checks agreed with each other because all three read the same wrong
source.

This is the failure mode this repository has spent a month building gates
against, committed by the process building the gates. The rule that a number
enters the paper only from its source applies with equal force to a claim about
the source itself. A cached copy is an artifact, and an artifact is not the
source of record.

What stopped it from reaching a commit: `release_session.sh` GATE 1 checks that
every anchor it intends to edit is present exactly once, and the
`validate_primary.py` anchor was absent, because the line it described does not
exist. The anchor check was written to catch drift in the manuscript. It caught
a fabricated premise instead. **Eleven of its twelve anchors verified against
the real files; the twelfth was the invented one.**

Two things follow, and both are cheap.

1. Re-stage before analysing, never after. The staging call reports a
   modification time; if it is older than the last commit touching that file,
   the copy is stale by definition and nothing read from it is evidence.
2. A finding about the repository gets the same treatment as a finding about the
   world: verified means read from the source this session, and anything else is
   recalled. The three epistemic states were applied to citations and to the
   Regulation all week, and not to the code.

Nothing false reached a commit. The two commits pushed today, `1c58102` and
`52b1e4c`, were checked for it and contain none of it.

## 2026-09-06. Pre-arXiv close: a repealed instrument, a bad median, and the typography

Four changes to the manuscript, two of them corrections of things that were
wrong, plus the release mechanics. Numbers in the results are untouched;
`scripts/audit_paper_numbers.py` still reports 81 checks, 0 failures.

### 1. CORRECTION. Section 8 quoted a repealed standardisation request

The open objection from the 2026-09-05 red team was that Articles 40 and 41 make
conformity presumptive on harmonised standards, so log content may live in the
standard rather than in the Regulation. Retrieving Article 40(1) verbatim
confirmed the mechanism. The first retrieval of the standardisation request
returned **C(2023) 3215 of 22 May 2023** and a draft paragraph quoted its Annex
II point 2.3 as the operative specification.

**C(2023) 3215 was repealed on 23 June 2025** by Article 4 of C(2025) 3871
(request M/613). The Commission's eNorm register caught it; the PDF of the
repealed document does not say it is repealed, and its own giveaway, that it
cross-refers to the AI Act "proposal" throughout, had been read and not acted on.

The corrected finding is stronger. C(2025) 3871 Annex II point 2.3 reads in its
entirety: "The harmonised standards and standardisation deliverables in this area
shall set up specifications for record keeping. Those specifications shall
comprehensively cover all elements referred to in Article 12 of Regulation (EU)
2024/1689." Thirty-two words, all of them a back-reference. Article 40 makes the
standard presumptive of Section 2; the request for the standard points back at
Article 12; Article 12 names three system-level purposes and an enumerated
minimum for Annex III point 1(a) alone. The delegation is circular in content.

`scripts/validate_standardisation_request.py` is new and wired into `verify.sh`.
It pins the manuscript's block quotation to the verbatim text committed at
`docs/sources/C2025_3871_standardisation_request.md`, checks the stated word
count, and fails if the paper names C(2023) 3215 without saying it was repealed.
Part VI of `docs/REGULATORY-BASIS.md` and eight new rows in
`docs/CITATION-LEDGER.md` carry the retrieval.

**Transferable rule, and the second of its kind in a week:** a legal instrument
retrieved from a search result has a status the instrument itself does not state.
Read the register, not only the text. The 2026-09-05 entry says the same thing
about a cached working tree.

### 2. CORRECTION. A median that was not a median

The withdrawn paragraph reported "a median of 115" across the ten deliverables of
the 2023 annex. Recomputing gave 112: 115 is the sixth value of a ten-element
sorted list, not its median. The word-count comparison has been removed entirely
rather than recomputed, because under the 2025 request the same formulaic sentence
appears at 2.1, 2.2, 2.7, 2.8 and 2.9, so length carries nothing. Recorded because
the error survived a reading, and because the interim guard that caught it, a
script that recomputed the counts from committed source, is the reason it was
caught at all.

### 3. A derivation where there had been an assertion

Section 7's reporting convention said the delta method "under-covers near
|g_j| = 1 where the linear term vanishes". It now gives the reason:
d g_j / d beta_k = (delta_jk - g_j g_k) / ||beta||, so ||grad g_j|| =
sqrt(1 - g_j^2) / ||beta||, using ||g|| = 1. The gradient vanishes exactly where
the constraint |g_j| <= 1 binds, so a symmetric first-order interval is not
confined to the parameter space it is an interval for. Two lines, and it removes
a claim the reader had to take on trust.

### 4. Typography, and a stale PDF

Every quotation in the manuscript used straight ASCII double quotes, which T1
typesets as a vertical glyph on both sides. Converted to LaTeX `` and '' by an
alternating pass over non-comment lines; the 24 resulting pairs were each printed
and read before the change was kept, the pass is balanced at EOF, and a
quote-normalised diff of `pdftotext` output shows no other change.

Separately: `paper/main.pdf` on the working machine was stale. It is gitignored,
so nothing wrong was committed, but it predated the 2026-09-05 red-team edits and
would have been the file uploaded to arXiv. Rebuilt. `make` and `make anon` both
build clean: 23 pages, no undefined references or citations, no overfull or
underfull boxes, and `scripts/check_anonymous.py` passes on the anonymous build.

### Release state

`make -C paper arxiv` writes `paper/p2-arxiv-submission.tar.gz` containing
`main.tex`, `main.bbl` and the two figure PDFs and nothing else. It is built in a
scratch directory and test-compiled with three `pdflatex` passes and no bibtex,
the way arXiv compiles it, and the recipe asserts the shipped `main.tex` is
byte-identical to `paper/main.tex`. A tarball rather than a directory because a
directory in a working tree keeps whatever the previous build left in it, which
is exactly what happened on the first attempt. Figures embed CID TrueType, no
Type 3, and both are legible in greyscale. `docs/ARXIV-SUBMISSION.md` holds the
metadata for the submission form, including the abstract trimmed to 1916
characters against arXiv's 1920-character limit; the manuscript's own abstract
was trimmed to match rather than allowed to diverge from it.

## 2026-10-25: README one-look section

Docs only. No code, config, result or preregistration file changed. Added the
interactive estimator bench (`docs/anatomy/`), three illustrations
(`docs/illustrations/`, hand-authored vector drawings) and a step-by-step
section to `README.md`. The figure and drawings are illustrative and make no
statistical claim; only the direct effect 0.25, the exact zero on about one run
in ten, the contrast between the marginal and same-dice readings, and the two
calendar dates are taken from the paper as the README states them.

Re-ran `bash verify.sh` in a fresh sandbox on Python 3.13.17 with numpy 1.26.4:
ALL GREEN (10 validators, citation coverage, 81 paper-number checks, 85 tests).
That run rewrites seven files in `results/` with a different `env.python` and
`env_hash` and last-digit float differences from the committed Python 3.11.9
artifacts. Those rewritten files were discarded (`git checkout -- results`) and
not committed, so the committed artifacts are unchanged. Anyone reproducing on a
different Python should expect the same.

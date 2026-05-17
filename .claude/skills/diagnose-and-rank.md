---
name: diagnose-and-rank
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - Beginning of a round, before `rsi-tournament`.
  - On-demand: when external signal suggests something is broken.
success_signal:
  - A ranked list of weaknesses is produced.
  - Each weakness has a novelty_score and a measurable angle.
tags: [core, loop, diagnosis]
---

# diagnose-and-rank — find what is weak

Produces input for `rsi-tournament`. The quality of this skill caps the
quality of the whole loop.

## Procedure

1. **Automated audit** of the current production site:
   - Lighthouse 4 axes (performance, accessibility, best practices, SEO)
   - axe-core accessibility scan
   - HTML validator
   - dead link check
   - bundle size delta vs previous round

2. **Behavioral audit** from analytics (when integrated):
   - top-3 highest-bounce pages
   - top-3 lowest-scroll-depth pages
   - any CTAs with CTR < median - 1 stddev
   - any pages with 95th-percentile time < 5 sec (likely accidental visits)

3. **Adversarial critic pass**: invoke a separate model (Codex, then
   later other critic skills) with the role:
   > "You are a hostile reviewer. Find the weakest aspect of this site.
   > Be specific. Avoid generalities."
   Feed it: the current production HTML of one page at random, plus
   the latest 3 weaknesses already addressed (so it can avoid repeats).

4. **Merge** automated + behavioral + critic findings into a single list.

5. **Novelty filter**: for each candidate weakness, compute cosine
   similarity to the last 20 addressed weaknesses (embedding source:
   simple TF-IDF for v0.1; upgrade later). Score = 1 - max similarity.
   Discard items below 0.4.

6. **Rank** by:
   - severity (impact size from audit)
   - measurability (is there a clean metric?)
   - tractability (can a single round plausibly move it?)
   - novelty (from step 5)
   Composite score is the average.

7. **Emit** the top 3 to `data/diagnoses/round-{N}.yml` for `rsi-tournament`
   to consume.

## Anti-patterns

- **Critic boredom**: if the adversarial critic produces vague output
  ("could be more engaging"), reject and re-prompt with a forced-choice:
  "Pick exactly one element on this page and explain why it fails."
- **Audit theater**: a green Lighthouse does not mean "nothing to improve."
  Always include at least one behavioral or critic weakness, even if
  audits are clean.

## History

- **v0.1** (2026-05-17): spawned at bootstrap.

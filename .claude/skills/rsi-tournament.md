---
name: rsi-tournament
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - A new round of the loop is starting.
  - There is at least one ranked weakness from `diagnose-and-rank`.
success_signal:
  - A winner variant is shipped behind a feature flag.
  - The trial log under `data/trials/round-N.md` is written and committed.
  - L5 score is recomputed.
tags: [core, loop, meta]
last_invoked: 2026-05-17
---

# rsi-tournament — the main round loop

This is the spine of every round after round 0.

## Procedure

1. **Load** the top-ranked weakness from `diagnose-and-rank`'s output.
   Skip weaknesses whose `novelty_score < 0.4` (too similar to previously
   addressed weaknesses).

2. **Frame** the hypothesis as a measurable target:
   - primary metric (e.g., bounce rate on /lab)
   - direction (lower / higher)
   - magnitude target (absolute or relative)
   - minimum traffic for decision (default: 50 sessions per variant or
     7 days, whichever comes first)

3. **Generate** `n=5` variants. Diversity is enforced — variants must
   differ on at least two of: copy, layout, color/typography,
   information architecture, interaction. Reject any variant that is
   a trivial rewording of another.

4. **Implement** each variant as a separate branch from current `main`.
   Each branch is named `trial/round-{N}/variant-{a..e}`.

5. **A/B configure**: create or update a PostHog feature flag named
   `round-{N}` with five buckets distributing equally. (When PostHog
   is not yet integrated, fall back to deterministic hashing of visitor
   ID via a small inline script; document in the trial log.)

6. **Deploy** all five variants on a single deploy. Mark in the
   manifest which build corresponds to which variant.

7. **Wait** until the minimum traffic condition is met.

8. **Select**:
   - If Bayesian P(best > runner-up) > 0.95 OR frequentist 95% CI excludes
     zero difference, declare the winner.
   - Otherwise, extend the window once. If still inconclusive, declare
     "no clear winner" and revert to the pre-round main.

9. **Ship** the winner. Open a PR that merges the winning branch into
   main. Auto-merge if CI is green.

10. **Log**: write `data/trials/round-{N}.md` with:
    - the weakness that motivated the round
    - the five variants (with diffs or short descriptions)
    - the traffic and metrics observed
    - the winner and the loser-list
    - what was learned about the *skills* that produced the winner

11. **Meta-update**:
    - Increment `win_rate` on skills that contributed to the winner.
    - Decrement on skills that produced losers.
    - If a skill's rolling win_rate < 0.2 over 10 invocations, retire it
      (move to `_archive/`, log to `index.md`).
    - If a pattern emerges (three rounds where the same diagnostic
      angle wins), spawn a new specialized skill that encodes that
      pattern.

12. **Recompute** L5 score and update `index.md`.

## Anti-patterns to avoid

- **Goodhart**: never optimize a single metric without a guardrail
  metric. If bounce drops but scroll depth also collapses, that is
  a regression, not a win.
- **Repeated mutation themes**: novelty filter applies to variants
  too, not just weaknesses.
- **Auto-merging without smoke tests**: even a winner must clear the
  build + a 5-page crawl check.

## Open questions (to evolve)

- What is the right `n`? 5 is a guess. Run an A/B on the value of `n`
  itself after round 5.
- Should "no clear winner" rounds count toward L5? Tentatively: yes,
  if they led to a skill being retired.
- When does Lup learn to stop and ask the operator for direction?
  Currently: never. Re-evaluate after round 10.

## History

- **v0.1** (2026-05-17): spawned at bootstrap. Spec only; first invocation
  scheduled for round 1.

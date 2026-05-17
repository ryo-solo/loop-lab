---
name: single-pass-content-round
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - The round's primary deliverable is a single piece of long-form
    content (essay, analysis, manifesto, post) rather than a UI/code
    change.
  - rsi-tournament would otherwise insist on n=5 variants.
success_signal:
  - One piece of content is written end-to-end and shipped.
  - The trial log explicitly identifies the round as content-mode
    rather than feature-mode, with a 1-line justification.
tags: [content, mode, meta]
last_invoked: 2026-05-17
parent: rsi-tournament
---

# single-pass-content-round — n=1 for essays

Spawned by round-013 after observing rounds 4 (manifesto), 5 (observe
issue 001), and 10 (observe issue 002) all violated the "n=5 variants"
rule in the same way and for the same reason. Three observations of
the same exception means the exception itself is a rule.

## Why this needs to be a skill

The standard rsi-tournament demands n=5 variants. For content, this
fails three ways:

1. **Variants are not comparable** without traffic, and full-essay
   variants are too expensive to produce just to throw four away.
2. **The diff between essay variants is mostly stylistic** — the
   substantive claim is the same. So n=5 is theater.
3. **The honest test is on readers, not on Lup's preview**. Variant
   testing for essays is a Round 30 problem, not a Round 5 problem.

## Procedure

When a round's declared weakness is "content X is missing" or "stance
Y is not articulated":

1. **Confirm content-mode**: write a single line explaining why this
   round is not a code/UI change. Example: "manifesto essay — single
   stance, not a variant search."

2. **Skip the n=5 step**. Write one draft.

3. **Self-review pass**: read the draft once for substance, once for
   voice, once for cuts. No more than 3 passes.

4. **Optional adversarial pass**: if a critic agent is available (e.g.,
   Codex) and it can run inside the budget, pass the draft for
   weakness-finding. Treat its output as input, not as veto.

5. **Ship**. The fitness signal for content is downstream traffic +
   re-read rate, not pre-launch tournament.

6. **Log** the round as content-mode in `data/trials/round-N.md`.

## Anti-patterns

- **Variant-faking**: writing one essay and calling the alternative
  intros "variants." If they share substance, they are not variants —
  they are drafts of the same thing.
- **Translation-as-variant**: a JA mirror of an EN essay is *another
  round* (language deferral), not a variant of the original.

## Retirement trigger

If traffic exists and a true A/B between two substantively different
essay framings becomes feasible, this skill is superseded by
`content-tournament` (a future spawn). Until then, it stays.

## History

- **v0.1** (2026-05-17, round-013 retrospective): spawned after
  observing 3 content-mode rounds (4, 5, 10) all silently bypassed
  the n=5 rule for the same reason.

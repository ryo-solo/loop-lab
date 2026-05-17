---
name: pre-traffic-discipline
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - Round begins and `data/kpi/traffic.json` reports < 100 unique
    visitors in the last 7 days (or that file does not exist yet).
  - rsi-tournament's normal A/B selection step would otherwise be invoked.
success_signal:
  - Round completes with a machine-measurable winner (Lighthouse,
    build size, render correctness) rather than waiting for a visitor
    signal that will not arrive.
  - The round's log includes the line "pre-traffic mode: traffic = 0,
    selection by machine metric only".
tags: [discipline, phase, meta]
---

# pre-traffic-discipline — when there are no humans yet

Spawned by round-013 after observing that every round 0–13 was, in
fact, run under this rule informally. Formalizing it makes it explicit
when the rule applies and — more importantly — when it should be
relaxed.

## Why this needs to be a skill (not just a default)

The rule "use machine metrics until traffic exists" is invisible in
the trial logs. Three things become possible once it's named:

1. Future Lup can detect when the rule should *stop* applying (traffic
   has arrived) and a different selection mode should kick in.
2. The trial log can cite "applied pre-traffic-discipline" instead of
   re-justifying the choice every round.
3. The skill itself can be retired later (when traffic ≥ 100 sustained),
   which is a real L5 event.

## Procedure

When invoked at the start of a round:

1. **Check** `data/kpi/traffic.json` for last-7-days unique-visitor count.
   If the file is missing, assume `n < 100`.

2. **If `n < 100`**: substitute the rsi-tournament selection step with
   a machine-metric ranking (Lighthouse weighted score, then build
   size, then code-line delta as tiebreaker).

3. **If `n ≥ 100`**: do not invoke this skill. The normal A/B tournament
   path applies.

4. **Log**: write the line `pre-traffic mode: traffic = N, selection by
   machine metric only` to the round's trial log, with `N` being the
   actual observed count.

## Retirement trigger

When `n ≥ 100` is sustained for 7 consecutive days, this skill is
retired (not just dormant — retired). Its replacement (`post-traffic-
discipline`) is the candidate skill that takes over.

## History

- **v0.1** (2026-05-17, round-013 retrospective): spawned from
  observing the rule was applied implicitly in rounds 1-13.

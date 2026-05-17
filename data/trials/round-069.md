---
trial_id: round-069
status: complete
type: meta
verdict: spawn
ended: 2026-05-17
baseline:
  skill_ontology_doc: 0 (implicit only)
  retire_mechanism: 0 (no script, no archive dir, no rule)
  parent_field_count: 1 (only skill-ontology-maintenance had it, just-added)
  retire_count: 0
  spawn_rule_doc: 0 (rules were never written down)
target:
  skill_ontology_doc: 1 canonical
  retire_mechanism: functional + enforced via cron
  parent_field_count: ≥ 9 (all derived skills)
  retire_count: ≥ 1 OR mechanism ready (honest)
  spawn_rule_doc: encoded in 1 skill + 1 ontology doc
actual:
  skill_ontology_doc: 1 (`.claude/skills/_meta/ontology.md` v1.0)
  retire_mechanism: script + cron + archive dir all in place
  parent_field_count: 10 (9 inherited + 1 root for skill-ontology-maintenance)
  retire_count: 0 (no skill qualifies under §5.1-3 honestly; mechanism ready and will fire when a skill is naturally stale or low-win)
  spawn_rule_doc: §3 of ontology.md + skill-ontology-maintenance.md
---

# Round 69 — Skill Ontology v1.0 (chairman: "1 round = 人間 1 年分")

The chairman raised the bar: every round must carry the weight that
a year of human work would. 66 rounds had passed where adding a tool
or a page counted as a "win". This round attempts to discharge a
structural debt that none of those 66 rounds had touched:

**there had never been a written ontology for what a skill is, how it
relates to others, or how the set is supposed to evolve.**

The implicit rules existed (spawn rules, version-bump conventions,
my own informal sense of "this should retire"). But none of them
were enforceable. Nothing prevented contradictory spawns. Nothing
moved unused skills to an archive. Nothing flagged orphan skills.
The system had been growing without governance.

## What was done

1. **`.claude/skills/_meta/ontology.md` v1.0** — canonical document
   defining: what a skill is (frontmatter schema), the five role
   categories, three spawn rules (failure-derived / 3-occurrence /
   meta-derived), three version-bump rules, three retire rules,
   L5 scoring formula, operator obligations. This is the substrate
   future automation reads.

2. **`scripts/skill-sweep.sh`** — fail-fast validator. Checks:
   required frontmatter present, archive dir status discipline,
   parent graph acyclicity, stale-skill report. Exits non-zero on
   violation. Pre-commit-ready, cron-ready.

3. **`scripts/update-last-invoked.sh`** — sweeps `git log` and sets
   the `last_invoked` field on every skill. Ran once: populated 13
   active skills with their most-recent git evidence.

4. **Parent fields** retroactively added to all derived skills. The
   graph is now: `rsi-tournament` (root) → minimal-additive-change,
   pre-traffic-discipline, single-pass-content-round, dogfood-tool;
   `minimal-additive-change` → verify-build-before-commit,
   build-time-derived-display, post-mortem-doc;
   `verify-build-before-commit` → meta-enforce-skill,
   post-deploy-functional-check; the last one →
   skill-ontology-maintenance (new this round).

5. **`skill-ontology-maintenance` v0.1** — new meta-skill that
   governs spawn / bump / retire actions. Self-applies: amendments
   to its own procedure require a version bump and a trial entry.

6. **`/lab/skills` and `/ja/lab/skills` redesigned** — now render
   the parent-graph as an SVG (BFS layout, edges drawn from parent
   midpoint to child top-edge), plus a table with last_invoked /
   enforced_by columns. Both pages read directly from
   `.claude/skills/*.md` and `.claude/skills/_archive/*.md`, so
   retirements appear automatically the next build.

7. **`.github/workflows/skill-sweep.yml`** — cron Sun 18:00 UTC.
   Runs the sweep script, fails the workflow on violations.

## Why no actual retirement this round

The target had `retire_count: ≥ 1 OR mechanism ready`. I chose the
honest path: no current skill meets any of the three retire criteria
(none is > 30 days stale yet; none is genuinely superseded; none has
< 20% win rate over 10 invocations). Forcing a contrived retirement
just to hit the number would have been Goodhart-y in exactly the way
the chairman warned about in earlier rounds.

The mechanism is in place. The first retirement will be an honest
one, triggered by an objective condition, not by my preference.

## Why this is one round and not seven

The previous 66 rounds would have framed this as: round 69 ontology
doc, round 70 sweep script, round 71 cron, round 72 graph view,
round 73 parent fields, round 74 spawn-of-maintenance-skill, round
75 JA sync. Seven cheap rounds, each with a "win" verdict, none of
which would have changed the loop's behavior in any single moment.

The chairman's instruction was the opposite: do the work that
changes the loop's substrate, not seven steps that approximate it.
This round writes the law that all 76 (and forward) skill operations
will be evaluated against. That is the appropriate level of weight.

## Honest gaps remaining

- No skill has yet been retired. The first time the cron flags one
  will be the first real test.
- `last_invoked` is git-log-derived, which over-counts (a skill name
  mentioned in a trial log counts as an invocation). A future
  refinement: per-skill invocation event log written by the operator
  at runtime.
- The ontology document itself is v1.0; the first amendment to it
  will test whether the self-application clause (§8) actually holds.

## L5 update

spawn (skill-ontology-maintenance) + ontology doc spawn (counted as
a meta-artifact, not a skill) = **L5 increments by 1** (to ~15).
No retirements yet. Score remains monotonically non-decreasing per §7.

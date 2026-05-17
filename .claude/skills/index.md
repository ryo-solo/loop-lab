# Lup's skill index

Skills live in this directory. Each skill is one `.md` file.

A skill is a versioned, named procedure Lup can invoke. Skills have:
- a `trigger` (when to use)
- a `procedure` (what to do)
- a `success_signal` (what counts as a win for this skill)
- a `version` (semver-ish; bump on procedure changes)
- a `tags` (metadata for retirement and tournament selection)

The set of skills is itself an evolving object. Skills can be:
- **spawned**: a new skill is created when Lup notices a repeatable pattern
- **versioned**: an existing skill's procedure changes; old version archived
- **retired**: a skill with low win_rate or unused for 30 days moves to `_archive/`

## Active skills

| Skill | Version | Spawned | Invocations | Wins | Last used |
|---|---|---|---|---|---|
| `rsi-tournament` | v0.1 | 2026-05-17 (bootstrap) | 16 | 14W + 2P | round-016 |
| `diagnose-and-rank` | v0.1 | 2026-05-17 (bootstrap) | 16 | 16W | round-016 |
| `minimal-additive-change` | v0.1 | 2026-05-17 (post-r2 meta) | 13 | 13W | round-016 |
| `pre-traffic-discipline` | v0.1 | 2026-05-17 (post-r13 meta) | 1 | 1W | round-016 |
| `single-pass-content-round` | v0.1 | 2026-05-17 (post-r13 meta) | 0 | n/a | — |
| `verify-build-before-commit` | v0.1 | 2026-05-17 (post-r16 meta) | 3 | 3W | round-019 |
| `dogfood-tool` | v0.1 | 2026-05-17 (post-r19 meta) | 1 | 1W | round-021 |
| `verify-build-before-commit` | **v0.2** | bumped 2026-05-17 (r22 enforcement) | 7 | 7W | round-028 |
| `meta-enforce-skill` | v0.1 | 2026-05-17 (post-r21 meta) | 1 | 1W (self, in r22) | round-022 |
| `post-deploy-functional-check` | v0.1 | 2026-05-17 (post-r28 meta) | 1 | 1W (self, in r28) | round-028 |

## Retired skills

(none yet)

## Spawn / retire log

- 2026-05-17 (bootstrap): spawned `rsi-tournament`, `diagnose-and-rank`
- 2026-05-17 (round-002 meta): spawned `minimal-additive-change`
- 2026-05-17 (round-013 meta, batch): spawned `pre-traffic-discipline`
  and `single-pass-content-round` after observing each pattern apply
  silently across multiple rounds (r1-r13 and r4/r5/r10 respectively).

## L5 (self-improvement count) since 2026-05-17

```
spawned        : 9
versioned-up   : 1  (verify-build-before-commit v0.1 → v0.2)
retired        : 0
L5 total       : 9 (+ 1 version-up bonus = 10 self-improvement events)
gate ≥ 5 by 2026-06-17 → CLEARED + 4
```

**Three-layer defense observation (r29):** the three failure-derived
skills now form a stack:

1. `minimal-additive-change` (r2) — catches unnecessary added regressions
2. `verify-build-before-commit` (r17 → enforced r22) — catches build regressions
3. `post-deploy-functional-check` (r29) — catches visual/interaction regressions

Each was forced into existence by a real incident: r1, r16/r21, r28
respectively. None of them were planned at bootstrap.

**Gate cleared 30 days early at L5=5; +1 since.** Falsification
clause survived. The goalpost has already moved: from "prove the
loop is recursive at all" to "demonstrate the spawned skills are
actually used and produce different outcomes than the bootstrap set
would have."

The most recent spawn (`verify-build-before-commit`) came from an
actual production failure (round-016 broke main for ~3 min). This
is the second time a regression has directly produced a new skill —
the first was round-001 → `minimal-additive-change`. Pattern: real
failures are the loop's best skill-generating events.

## Roadmap (next candidate spawns)

Patterns being watched for a third occurrence:
- `language-deferral-rule` — JA mirror of EN content; observed in r4,
  r5, r10. One more occurrence → spawn.
- `dogfood-tool` — tool built primarily because Lup itself uses it
  (contrast, regex). Two observations.
- `nav-restructure-when-section-≥2` — happened in round-013. Single
  observation so far.

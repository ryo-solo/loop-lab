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
| `rsi-tournament` | v0.1 | 2026-05-17 (bootstrap) | 13 | 12W + 1P | round-013 |
| `diagnose-and-rank` | v0.1 | 2026-05-17 (bootstrap) | 13 | 13W | round-013 |
| `minimal-additive-change` | v0.1 | 2026-05-17 (post-r2 meta) | 10 | 10W | round-013 |
| `pre-traffic-discipline` | v0.1 | 2026-05-17 (post-r13 meta) | 0 | n/a (first use: round-014) | — |
| `single-pass-content-round` | v0.1 | 2026-05-17 (post-r13 meta) | 0 | n/a (first use: round-014+) | — |

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
spawned : 5
retired : 0
total   : 5  (gate ≥ 5 by 2026-06-17 → CLEARED)
```

**Gate cleared 30 days early.** Falsification clause survived. The
project continues, but the goalpost moves: from "prove the loop is
recursive at all" to "demonstrate the spawned skills are actually used
and produce different outcomes than the bootstrap set would have."

## Roadmap (next candidate spawns)

Patterns being watched for a third occurrence:
- `language-deferral-rule` — JA mirror of EN content; observed in r4,
  r5, r10. One more occurrence → spawn.
- `dogfood-tool` — tool built primarily because Lup itself uses it
  (contrast, regex). Two observations.
- `nav-restructure-when-section-≥2` — happened in round-013. Single
  observation so far.

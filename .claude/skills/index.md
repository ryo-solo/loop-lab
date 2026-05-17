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
| `rsi-tournament` | v0.1 | 2026-05-17 | 2 | 1 (partial r1) + 1 (full r2) | round-002 |
| `diagnose-and-rank` | v0.1 | 2026-05-17 | 2 | 2 | round-002 |
| `minimal-additive-change` | v0.1 | 2026-05-17 (post-r2 meta) | 0 | n/a | (first use: round-003) |

## Retired skills

(none yet)

## Spawn / retire log

- 2026-05-17 (bootstrap): spawned `rsi-tournament` v0.1, `diagnose-and-rank` v0.1
- 2026-05-17 (round-002 meta-learning): spawned `minimal-additive-change` v0.1

## L5 (self-improvement count) since 2026-05-17

```
spawned : 3
retired : 0
total   : 3  (gate ≥ 5 by 2026-06-17)
```

Round-003 will be the first round under all three skills, and the
first chance for `minimal-additive-change` to be exercised.

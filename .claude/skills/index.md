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

| Skill | Version | Spawned | Win rate | Last used |
|---|---|---|---|---|
| `rsi-tournament` | v0.1 | 2026-05-17 | n/a (bootstrap) | - |
| `diagnose-and-rank` | v0.1 | 2026-05-17 | n/a (bootstrap) | - |

## Retired skills

(none yet)

## L5 (self-improvement count) since 2026-05-17

```
spawned : 2
retired : 0
total   : 2  (gate ≥ 5 by 2026-06-17)
```

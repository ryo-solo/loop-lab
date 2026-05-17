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
| `rsi-tournament` | v0.1 | 2026-05-17 | 8 | 7 full + 1 partial | round-008 |
| `diagnose-and-rank` | v0.1 | 2026-05-17 | 8 | 8 | round-008 |
| `minimal-additive-change` | v0.1 | 2026-05-17 (post-r2) | 5 (r4-r8) | 5 | round-008 |

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

`minimal-additive-change` has now been exercised 5 times (r4-r8) with
zero observed regressions of its kind. After 10 invocations the skill
will be reviewed for potential v0.2 refinement.

## Roadmap (candidate spawns)

Patterns observed but not yet skill-ified:
- "n=1 round when content is the deliverable" (essays, analyses) →
  may spawn `single-pass-content-round` after one more occurrence
- "deferred translation" (round 4: JA done, round 5: JA skipped) →
  may spawn `language-deferral-rule` after consistent application
- "machine-only verification when traffic = 0" (r0-r8) → may spawn
  `pre-traffic-discipline` once traffic appears and the rule needs
  to be relaxed

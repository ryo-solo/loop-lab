---
title: loop-lab skill ontology
version: 1.0
canonical: true
governs: .claude/skills/*.md
---

# loop-lab Skill Ontology

This is the canonical, machine-readable spec for what a "skill" in
loop-lab is, how skills relate to each other, and how the set of
skills evolves over time. This document replaces the implicit
ontology that operated through rounds 0–68.

It is itself a skill artefact in the sense that the loop is expected
to revise it; revisions are version-bumps (`version: 1.0` → `1.1`),
recorded in the History section at the bottom.

## 1. What a skill is

A skill is a named, versioned, file-backed procedure that the operator
(Lup) invokes during the operation of the loop. The skill file
(`.claude/skills/<name>.md`) is the **single source of truth** for its
trigger, procedure, success signal, and lineage.

Required frontmatter fields:

| field | type | meaning |
|---|---|---|
| `name` | string | filename minus `.md`; lowercase-kebab |
| `version` | semver-ish | bumped on procedure changes (see §4) |
| `spawned` | ISO date + provenance | when and by which round / pattern |
| `status` | `active` ｜ `retired` ｜ `superseded` | lifecycle state |
| `trigger` | list | when the skill should fire |
| `success_signal` | list | what counts as a successful invocation |
| `tags` | list | category labels |

Optional fields:

| field | meaning |
|---|---|
| `enforced_by` | path to the runtime guardrail (hook, CI step, lint rule) |
| `dependencies` | list of other skills this one builds on |
| `supersedes` | list of other skills this one replaces |
| `retired_at` | ISO date if status = retired |
| `last_invoked` | ISO date, auto-updated by sweep script |
| `parent` | direct ancestor skill (for visualization) |

## 2. Skill categories

By **role** in the loop (mutually exclusive, primary tag):

- **core** — fundamental loop mechanics (`rsi-tournament`, `diagnose-and-rank`).
- **discipline** — anti-drift / anti-regression (`minimal-additive-change`,
  `verify-build-before-commit`, `post-deploy-functional-check`,
  `build-time-derived-display`, `post-mortem-doc`).
- **mode** — round-shape rules (`single-pass-content-round`,
  `pre-traffic-discipline`, `dogfood-tool`).
- **tool** — invokes external capability (`codex-collaboration`).
- **meta** — operates on other skills (`meta-enforce-skill`,
  `skill-ontology-maintenance`).

Cross-cutting tags (multiple allowed): `phase`, `failure-derived`,
`planning-derived`, `enforced`, `content`, `infrastructure`.

## 3. Spawn rules

A new skill may be spawned only when one of these triggers is satisfied,
and the trigger is cited in the spawning round's trial log:

1. **Failure-derived** — a production regression or near-regression was
   caused by the absence of the would-be skill. The post-mortem is the
   first artefact; the skill is the second.
2. **Pattern-observed (3-occurrence rule)** — the same procedure was
   applied implicitly across ≥ 3 prior rounds. Naming it makes it
   explicit and auditable.
3. **Meta-derived** — a new skill operates on existing skills (e.g.,
   enforces, retires, replaces them). These are higher in the
   abstraction stack.

Spawning a skill that does not meet any of the three is forbidden.
Planning-driven spawns are allowed only at bootstrap (round 0) and
should be marked `planning-derived` in tags; they have lower priors
on win-rate and are subject to retirement first.

## 4. Version-bump rules

A skill's `version` bumps when:

- **0.x → 0.(x+1)** — procedure changed but trigger is unchanged.
- **0.x → 1.0** — first version with `enforced_by` field set (skill
  moved from procedural to runtime-enforced).
- **major bump** — trigger changes such that older invocations no
  longer apply.

Every bump must reference the round that initiated it in the History
section.

## 5. Retire rules

A skill is retired when **any** of:

1. **Stale** — `last_invoked` is more than 30 days ago AND `status` is
   `active`. Auto-sweep moves it.
2. **Superseded** — another skill explicitly `supersedes:` this one.
   Manual move, with citation.
3. **Low win-rate** — over 10 invocations, win count is < 20%. Manual
   move with retrospective in `data/trials/`.

Retirement is a structural event: the file moves to
`.claude/skills/_archive/<name>.md`, status flips to `retired`, and the
move is logged in `data/trials/round-NNN.md` as a `retire` verdict.

Retired skills count toward L5 the same as spawned ones. The signal is
**movement**, not net count.

## 6. Dependency graph

Skills can be parents of other skills (e.g., `minimal-additive-change`
is the parent of `verify-build-before-commit`, which is the parent of
`post-deploy-functional-check`). The graph is encoded via the `parent`
field; cycles are forbidden.

Visualisation lives at `/lab/skills/` (auto-generated at build time
from the frontmatter).

## 7. L5 scoring

L5 = (number of spawn events) + (number of retire events) +
     (number of version-bump events at minor or higher).

L5 is **monotonically non-decreasing** by construction. A loop that
sits idle does not increase L5. A loop that churns (spawn-and-retire
in the same week) increases L5 but its rounds will show low wins; the
combined signal exposes wheel-spinning.

## 8. Operator obligations

Lup (the operator) is responsible for:

- Updating a skill's `last_invoked` when invoking it (or letting the
  sweep script do it automatically via git log inspection).
- Filing the spawn-event trial log when adding a skill.
- Filing the retire-event trial log when removing one.
- Never editing `_archive/*.md` (those are historical artefacts).
- Bumping this document's version when changing the ontology itself.

## History

- **v1.0** (round-069, 2026-05-17): initial canonical ontology. Replaces
  the implicit rules that operated through rounds 0–68. The implicit
  rules had been correct in spirit but were not enforceable; this
  document is the substrate the sweep script can read.

---
name: skill-ontology-maintenance
version: 0.1
spawned: 2026-05-17 (round-069)
status: active
trigger:
  - About to spawn, version-bump, or retire any skill in `.claude/skills/`.
  - The action would be invisible without an entry in
    `data/trials/round-NNN.md`.
success_signal:
  - The action conforms to one of the three spawn rules, version-bump
    rules, or retire rules in `.claude/skills/_meta/ontology.md`.
  - A trial log entry exists with `verdict: spawn` ｜ `retire` ｜
    `version-bump` and cites the trigger.
  - The skill file's frontmatter reflects the change.
parent: meta-enforce-skill
tags: [meta, governance, enforced]
enforced_by: scripts/skill-sweep.sh (cron weekly)
---

# skill-ontology-maintenance — govern the skill graph itself

Spawned by round-069 alongside the canonical ontology document. This
skill operates one level above all other skills: it governs how the
skill set itself evolves. Without it, the rules in
`.claude/skills/_meta/ontology.md` would just be a wish.

## Procedure

When proposing a skill change (spawn / version-bump / retire):

1. **Identify** which ontology rule (§3 spawn, §4 bump, §5 retire)
   applies. Cite it.

2. **Author** the trial log entry first, before editing the skill
   file. The entry must include:
   - `verdict: spawn` ｜ `verdict: retire` ｜ `verdict: version-bump`
   - Which rule triggered the change
   - For spawn: which rounds embodied the pattern (≥ 3 for §3.2);
     for retire: which condition (§5.1, .2, or .3); for bump: what
     procedure changed.

3. **Edit** the `.claude/skills/*.md` file. Frontmatter must validate
   against the ontology schema.

4. **Run** `scripts/skill-sweep.sh` to verify no constraint violations
   (cycles in `parent`, missing fields, etc.).

5. **Commit** with conventional prefix `meta:`, citing the ontology
   rule in the commit message.

## Anti-patterns

- **Drive-by spawning** — adding a skill in passing, without a trial
  entry. The skill graph is not an ad-hoc inbox.
- **Soft retirement** — marking a skill `status: retired` but leaving
  it in the active directory. Retirement is a file move, not a status
  flip in place.
- **Version-stable changes** — editing the procedure of an existing
  skill without bumping `version`. Future readers cannot then tell
  whether they are looking at the procedure that was in effect during
  some past round.

## Why this is the eighth meta-skill

The first seven anti-drift / governance skills operate on the site
or on the loop's rounds. This one operates on **the skill graph
itself**. It closes a recursive gap: previously, when the loop
modified its own procedures, there was no procedure governing those
modifications. Now there is.

The next gap above this would be a skill governing how *this skill*
is itself amended. That regress stops here by convention: amendments
to `skill-ontology-maintenance` follow `skill-ontology-maintenance`,
i.e., they require a trial log and a version bump. The fixed point
of the recursion is "self-application."

## History

- **v0.1** (2026-05-17, round-069): spawned alongside the canonical
  ontology document. Failure-derived: rounds 67 (link drift) and 68
  (JA mono-lingual debt) both surfaced cases where skills had been
  spawned but never retired, leaving the live graph out of sync with
  what the loop was actually using.

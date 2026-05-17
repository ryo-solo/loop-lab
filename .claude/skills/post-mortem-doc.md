---
name: post-mortem-doc
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - A round produced a real production regression (404, broken build
    on main, visible UI breakage) AND the round's fix worked.
success_signal:
  - A `data/trials/round-NNN.md` entry exists with verdict `partial`
    and a "what broke / blast radius / fix / skill spawned" structure.
  - The /lab/post-mortems page lists the incident (auto-rendered from
    the trial log eventually).
tags: [discipline, content, post-incident]
last_invoked: 2026-05-17
parent: minimal-additive-change
---

# post-mortem-doc — every real failure gets a public entry

Spawned by round-055. Four real failures so far (r1, r16, r21, r28)
all eventually got written up, but the pattern of writing them was
ad-hoc — sometimes a paragraph inside the next-round commit, sometimes
a separate trial file, once (r28) a dedicated public page. Naming the
skill standardizes the format and lowers the activation cost.

## Procedure

When a fix lands for an observed regression:

1. **Write** or update `data/trials/round-NNN.md` (NNN = the round
   that broke things). Verdict: `partial` if same-round fix,
   `failure` if rolled back.

2. Include four sections:
   - **what broke** (one paragraph; the user-visible symptom)
   - **blast radius** (time on main + scope of impact)
   - **fix** (which commit, which file)
   - **skill spawned or skill version-bumped** (link to the
     `.claude/skills/*.md`)

3. **Update** `/lab/post-mortems.astro` to include the new entry,
   in chronological order.

4. **Cross-reference** from the spawned skill's `History` section.

## Why this is a skill

Failures are the loop's best skill-generating events (observe/issue-003).
The skill-generating step is structurally fragile: a failure that
isn't written up doesn't seed a skill, because the loop has nothing
durable to learn from. The post-mortem is the durable artifact.

## History

- **v0.1** (2026-05-17, round-055): retroactive formalization after 4
  incidents had already been documented with mostly-converging structure.

---
name: build-time-derived-display
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - About to hand-maintain a display value (count, table, list, status
    block) whose source of truth lives in another file (`.claude/skills/`,
    `data/trials/`, `data/kpi/`, etc.).
  - The display has changed twice without a coordinated source-file change.
success_signal:
  - The display is computed at build time from the source-of-truth files,
    not transcribed.
  - Editing the source automatically updates the display on next build.
  - No "remember to update both" maintenance burden.
tags: [discipline, anti-drift, infrastructure]
last_invoked: 2026-05-17
parent: minimal-additive-change
---

# build-time-derived-display — render from source, never transcribe

Spawned by round-034 after the same pattern fired three times in three
consecutive rounds:

1. r031: `/lab/skills` was a hand-maintained array. Replaced with
   build-time read of `.claude/skills/*.md`.
2. r032: `/lab/timeline` was a hand-maintained array. Replaced with
   build-time read of `data/trials/*.md`.
3. r033: home status blocks (EN + JA) had hand-coded counts. Replaced
   with `computeState()` from `src/lib/state.ts`, which reads both
   directories.

In every case the trigger was the same: I had to update two files in
lockstep, and once or twice (r28 specifically) the drift caused a
visible regression. Codifying the pattern stops it from happening
silently next time.

## Procedure

When designing or touching a display element that shows facts about
the loop's state (skill counts, round counts, KPI numbers, file lists):

1. **Identify** the file-of-truth. If there is none yet, write the
   file before the display.

2. **Reject** the transcribed-into-template approach.

3. **Implement** the display as a build-time read:
   - `fs.readdirSync` + `fs.readFileSync` in the `.astro` frontmatter,
     for files outside `src/`.
   - `import.meta.glob` for files inside `src/`.
   - A small helper in `src/lib/` if more than one page reads the
     same data.

4. **Verify** by editing the source file and re-running `npm run build`.
   The display must reflect the edit without any template change.

## Anti-patterns

- **"It's just one number"**: that's how all transcription bugs start.
  The cost of `computeState()` for one number is negligible; the cost
  of forgetting to update it scales with rounds.
- **Client-side fetch**: don't ship the source files as JSON at runtime
  just to dynamic-render. Build-time is the right phase — it locks in
  the value, it's faster, and it doesn't require a network round-trip.

## Why this skill

Together with `minimal-additive-change`, `verify-build-before-commit`,
and `post-deploy-functional-check`, this is the fourth anti-drift
skill. They cover four distinct ways the loop's behavior can degrade
silently:

- additive-change: unintended additions
- build-verify: toolchain regressions
- functional-check: visual/interaction regressions
- this: source-of-truth drift

## History

- **v0.1** (2026-05-17, round-034): spawned after three consecutive
  rounds (r031, r032, r033) all applied the same read-from-disk
  pattern to remove hand-maintained displays.

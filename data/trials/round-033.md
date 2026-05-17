---
trial_id: round-033
status: complete
type: infra
verdict: win
ended: 2026-05-17
---

# Round 33 — auto-sync home status block from disk

Third operational round. The home page (EN + JA) status block was
hard-coded with numbers I had to update by hand after every spawn
or round. After r28 missed the mobile bug, I want **fewer things
that drift**, not more.

Implementation:
- New `src/lib/state.ts` with `computeState()` reading
  `.claude/skills/*.md` and `data/trials/*.md` from disk.
- Counts: skills active, retired, version-bumped, last round,
  last verdict.
- Both `/` and `/ja/` import and render from the computed state.
- L5 = skills spawned (= active + retired); the version-bumped
  count is now a separate display field, not folded in.

Pattern: third application of 'replace hard-coded values with
read-from-disk-at-build-time.' First three were:
1. r031: skill graph (.claude/skills/)
2. r032: timeline       (data/trials/)
3. r033: home status    (both, via state.ts)

Per the loop's own '3 observations = spawn a skill' rule, this is
the trigger for a new meta skill: `build-time-derived-display`.
Will spawn in r034.

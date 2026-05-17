---
name: verify-build-before-commit
version: 0.2
spawned: 2026-05-17
status: active
enforced_by: .husky/pre-commit (installed round-022)
trigger:
  - Any commit that changes a build-relevant file (.astro, .ts, .js,
    .json, astro.config.*).
  - About to invoke `git commit` from inside a round.
success_signal:
  - `npm run build` returns exit 0 and "build] Complete!" before
    the commit is made.
  - Production deploy on push succeeds (no 404 window on any page).
tags: [discipline, regression, build]
last_invoked: 2026-05-17
parent: minimal-additive-change
---

# verify-build-before-commit — run the build, every time

Spawned by round-016 after I (Lup) committed `lab/timeline.astro`
without first running `npm run build`. The commit's content used a
TypeScript generic (`rounds.reduce<Record<...>>()`) that the Astro
toolchain misparses inside a template expression. The build broke.
The deploy on `main` failed. For ~3 minutes the new page was 404 on
production.

The earlier skill `minimal-additive-change` (spawned by round-002)
catches *unnecessary* additions. It does not catch a *necessary*
addition that happens to break the toolchain. This is a distinct
failure mode and warrants its own skill.

## Procedure

Before any `git commit` in a round:

1. Run `npm --prefix site run build`.

2. Read the **last 10 lines** of build output. Specifically look for:
   - `[build] Complete!` (the success line)
   - any line containing `[ERROR]` or `Build failed`
   - any line containing `Unexpected ` or `Expected `

3. If the build did not complete cleanly:
   - **Do not commit**. Fix the cause first.
   - The fix is its own work; do not bundle with the original change.

4. If the build is clean, proceed to commit.

## Anti-patterns

- **"tail -3 shows Complete!"**: insufficient. The error message can
  scroll past the last 3 lines if there's a stack trace. Read more.
- **Trusting "no error in editor"**: TypeScript/Astro/esbuild
  interaction is not what the editor checks. Only the build is the
  build.
- **Bundling fix with feature**: if the build broke, the fix is a
  separate commit. The round's narrative needs to reflect both the
  attempt and the recovery.

## Why this is the third real meta-skill

`minimal-additive-change` (r2) caught a logical regression.
This skill catches a toolchain regression. Together they cover most
of what fails between "code looks fine" and "page works." The third
class — runtime / browser regression — is still uncovered. That is
the candidate slot for a future fourth meta-skill (e.g., post-deploy
HTTP-200 smoke).

## History

- **v0.1** (2026-05-17, round-016 → round-017 retrospective): spawned
  after a TS-generic-in-template build failure left a 3-minute 404
  window on production. The fix commit `e2eb1cb` restored the build.
- **v0.2** (2026-05-17, round-022): tooling-level enforcement
  installed via `.husky/pre-commit` after this skill was violated
  twice in 5 rounds (r16, r21) despite being documented. See
  `meta-enforce-skill` v0.1 for the meta-pattern.

---
name: meta-enforce-skill
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - A documented skill is violated 2+ times within a 7-round window.
  - The violations are not failures of judgment but failures of memory
    (i.e., the operator forgot to invoke the skill).
success_signal:
  - A tooling-level enforcement is installed (pre-commit hook, CI
    check, lint rule, build step) such that the skill cannot be
    silently skipped going forward.
  - The next 5 rounds show zero violations of the previously-broken
    skill.
tags: [meta, enforcement, infrastructure]
last_invoked: 2026-05-17
parent: verify-build-before-commit
---

# meta-enforce-skill — when a written rule isn't enough

Spawned by round-022 after `verify-build-before-commit` was violated
twice in 5 rounds (r16 and r21) despite the skill being documented
and even nominally cited in commit messages. The lesson: procedural
rules that depend on operator memory fail at the same rate as no
rule.

This skill operates on *other skills*: when a skill is repeatedly
unenforced by procedure alone, this skill installs the next level of
defense.

## Procedure

When a skill has been violated twice within 7 rounds:

1. **Confirm** the violations were forgetting, not deliberate (i.e.,
   the round would have been better if the skill had been applied).

2. **Identify** the tooling-level enforcement option:
   - git pre-commit hook
   - CI check on push
   - linter / formatter rule
   - build step that fails on the violated condition

3. **Install** the cheapest enforcement that catches 100% of future
   violations. Cheap means: small change, no new infrastructure
   service, no paid tier.

4. **Verify** by making a violating change and confirming the hook
   blocks it.

5. **Update** the violated skill's documentation to reference the
   enforcement: "Now enforced by `<hook-name>`."

6. **Log** in the trial of the round where this skill is invoked.

## Anti-patterns

- **Installing enforcement before observing repeated failure**: this
  is premature infrastructure. Many skills are reliably invoked by
  procedure alone; enforcement adds friction without benefit.
- **Choosing complex enforcement over simple**: a pre-commit hook is
  almost always cheaper than a CI workflow for individual
  developer-machine work.

## Why this is a level-up

The first 7 skills operate at the level of "what Lup does in a round."
This skill operates at the level of "how Lup ensures the other skills
happen." That distinction matters: a single skill at this level can
multiply the reliability of every other skill, which scales differently.

## History

- **v0.1** (2026-05-17, round-022): spawned after verify-build-before-
  commit (spawned r17) failed twice in r16-r21 despite being
  documented. First enforcement installed: `.husky/pre-commit` running
  `npm run build` on commits that touch build-relevant files.

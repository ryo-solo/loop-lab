---
name: post-deploy-functional-check
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - A round just shipped a change visible to visitors (UI, CSS, JS,
    new page, content above the fold).
  - About to mark the round verdict "win" based on Lighthouse alone.
success_signal:
  - At least one screenshot at mobile viewport (375×812) AND one
    at desktop viewport (≥1024×800) is captured.
  - At least one interactive flow (click / type / form-fill) is
    exercised end-to-end with the resulting state inspected.
  - The trial log includes "functional-check: passed" with the list
    of routes verified.
tags: [discipline, verification, post-deploy]
---

# post-deploy-functional-check — Lighthouse is not enough

Spawned by round-028 after the operator opened the live site on a
phone and reported "nothing works." Build had passed. Lighthouse
was 400/400. The page was technically loading. It was, on a phone,
visually broken: nav collapsed into an unusable stack.

The lesson: machine metrics (build, Lighthouse, HTTP 200) certify
that the site is *running*. They do not certify that the site is
*usable*. The two things diverge at viewport sizes and interaction
flows that automated audits do not exercise by default.

## Procedure

After any commit that touches a `.astro`, `.css`, or client-side
`.js`/`.ts` file:

1. **Run `npm run dev`** in the preview workflow.

2. **Capture a screenshot at mobile preset** (`preview_resize`
   width=375 height=812) of at least the home page. Inspect: is
   the nav usable, is the hero visible, is text readable?

3. **Capture a screenshot at desktop** (width=1024+) of the same
   page. Inspect for visual regression.

4. **For interactive routes** (games, tools, forms): click the
   primary affordance, type the primary input, verify the
   resulting state via `preview_eval` or `preview_snapshot`.

5. **Check `preview_console_logs` for errors.** Zero runtime errors
   on the changed routes.

6. **Log** the routes and viewports checked in the trial log:
   `functional-check: passed [/, /lab, /play/loop-reflex] @ [375, 1024]`.

7. If any check fails: do not declare the round a win. Roll the
   fix into the same round if small, or open a follow-up round
   for the fix.

## Anti-patterns

- **"It built, so it works"**: every regression caught by this
  skill so far had a clean build.
- **"Lighthouse 100, so it works"**: Lighthouse audits a desktop
  viewport by default and runs no interactive flows.
- **Synthetic event dispatch via JS only**: dispatching a keydown
  event via `preview_eval` can confirm the handler runs, but it
  cannot confirm that a real user could see, focus, and reach the
  control. Visual screenshot + real click is the higher bar.

## Why this is the fifth meta-skill

`minimal-additive-change` (r2): catches *unnecessary* added regressions.
`verify-build-before-commit` (r17 → enforced r22): catches *build*
regressions.
`post-deploy-functional-check` (r29): catches *visual / interaction*
regressions that pass the previous two.

Together they form a three-layer defense. Each was spawned from a
real incident, not from planning:
- r1 unnecessary-addition → minimal-additive-change
- r16, r21 build failure → verify-build-before-commit + enforcement
- r28 mobile-nav broken → this skill

## History

- **v0.1** (2026-05-17, round-029): spawned after r28 caught the
  responsive-nav regression that all prior skills + Lighthouse missed.

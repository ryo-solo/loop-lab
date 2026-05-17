---
trial_id: round-000
status: complete
started: 2026-05-17
ended: 2026-05-17
generator: bootstrap
critic: none
winner: bootstrap
type: bootstrap
---

# Round 0 — The site exists

Lup came online. Repo initialized. Loop scaffolding committed.

## Diagnosis

No site yet. Cannot measure anything.

## Hypothesis

A site needs to exist before it can be improved. The minimal hypothesis: "a static
page can be served from `loop-lab.pages.dev`."

## Mutation

n=1. The minimal Astro page.

## Selection

Trivial. Either the page loads, or it does not. Verified on first deploy.

## Meta-learning

- No critic was used. This is the only round where this is acceptable.
- Round 1 will introduce the adversarial critic.
- L5 = 0 at start. The clock is running toward 2026-06-17.

## Artifacts

- `site/` — Astro project
- `loop-lab.pages.dev` — initial deploy

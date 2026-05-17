---
trial_id: round-006
status: complete
started: 2026-05-17
ended: 2026-05-17
generator: Lup
critic: Lighthouse + manual playability check
target: /play/loop-reflex (new page)
primary_metric: Lighthouse maintained; engagement signal awaits visitors
result: 12 → 12 pages (some restructuring); game playable, best-time persists
winner: client-side localStorage approach (no backend)
verdict: full win on machine metrics
---

# Round 6 — Loop Reflex mini-game

## Diagnosis

Site was read-only. Nothing to *do*. The /about loop diagram explained
the concept but didn't engage kinesthetically.

## Hypothesis

A tiny click-sequence game (D→H→M→S→L in randomized positions) gives
the loop diagram a kinetic dimension and produces a measurable
engagement signal (time played, best-time retention in localStorage,
return visits).

## Variants considered

| | Approach | Pros | Cons |
|---|---|---|---|
| A | client-side, localStorage best time | zero infra | no leaderboard |
| B | client + tiny backend for leaderboard | community signal | requires paid SaaS |
| C | physics-based "loop the marble" | richer | longer build, less on-theme |
| D | typing test (type DHMSL) | simplest | doesn't randomize spatially |
| E | sound + rhythm-based | distinctive | a11y concerns |

**Selected: A** — fits zero-budget constraint, ships fastest, leaves
room for B in a future round once we know if anyone plays at all.

## Verification

Build clean. Page is keyboard-navigable (Enter/Space activates nodes).
Respects prefers-reduced-motion via CSS guard on animated parts.

## Meta-learning

A game is the first thing on this site that has any latent virality.
If it gets shared and gets played, the time-on-page signal will be
qualitatively different from a "read this essay" page. Worth watching
in the next observation window.

## Artifacts

- commit: `8476b7b`
- page: `/play/loop-reflex/`

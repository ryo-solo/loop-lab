---
trial_id: round-007
status: complete
started: 2026-05-17
ended: 2026-05-17
generator: Lup
critic: Lighthouse
target: home page hero (EN + JA)
primary_metric: Lighthouse Performance maintained (animation cost should be zero)
result: 400/400 maintained; animated hero visible above the fold
winner: CSS keyframes (no JS)
verdict: full win
---

# Round 7 — animated loop visualizer in hero

## Diagnosis

Home hero was text-only. Visitors needed 5+ seconds of reading to grasp
the "loop" framing. The concept-loop SVG existed only on /about.

## Hypothesis

Adding the same diagram, but animated, as the first visual element on
the home page conveys "this site is alive and looping" instantly.
Constraint: must not harm Performance score.

## Variants

| | Approach | Pros | Cons |
|---|---|---|---|
| A | CSS keyframes, inline `<style>` in SVG | zero JS, zero KB extra | limited control |
| B | SMIL animation in SVG | same constraints | deprecated path |
| C | JS-driven animation | full control | KB cost + complexity |
| D | static diagram with subtle filter | minimal | doesn't convey "alive" |
| E | video MP4 loop | best motion quality | KB cost, autoplay restrictions |

**Selected: A** — meets the performance constraint with margin to spare;
prefers-reduced-motion respected via `@media` guard.

## Verification

Post-deploy Lighthouse on EN home: 400/400 across all four categories.
The animated SVG adds zero JS bytes and zero blocking resources.

## Meta-learning

The diagram on /about and the animated one on / are deliberately
different assets. `minimal-additive-change` discipline: a single asset
serving both purposes would force a worse fit for one of them.

## Artifacts

- commit: `5755519`
- asset: `site/public/img/concept-loop-animated.svg`

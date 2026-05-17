---
trial_id: round-008
status: complete
started: 2026-05-17
ended: 2026-05-17
generator: Lup
critic: Lighthouse + spot-check of WCAG formula
target: /tools/contrast (new page)
primary_metric: Lighthouse maintained; tool returns correct ratios
result: 13 pages built; spot-check against known WCAG pairs passes
winner: pure client-side (no backend, no library)
verdict: full win
---

# Round 8 — contrast checker utility

## Diagnosis

Site had no *useful* thing for a visitor to do (the game is fun, not
utilitarian). A page that returns a concrete answer to a real question
("is this color combination accessible?") lowers bounce for /tools
entries from search/aggregator traffic.

## Hypothesis

A WCAG contrast checker, fully client-side, is the cheapest utility
that demonstrates loop-lab's "useful without APIs" claim and is
naturally dogfood-able by Lup on the site itself.

## Variants

| | Approach | Pros | Cons |
|---|---|---|---|
| A | inline JS, no deps, hex/rgb/named | zero infra | manual WCAG formula |
| B | pull a contrast library via npm | well-tested | KB cost + tree-shake risk |
| C | server-side computation | could log usage | requires backend |
| D | static reference table only | no JS | not interactive |
| E | full color suite (contrast + APCA + palette) | most useful | round-bloat |

**Selected: A** — matches the budget and the "minimal additive" rule.
Variant E is a candidate for a future round once we see traffic on the
basic checker.

## Verification

Spot-checked against known WCAG pairs:
- `#000` / `#fff` → 21.0 ✓
- `#777` / `#fff` → 4.48 (AA-large pass) ✓
- `#888` / `#fff` → 3.54 (AA-large pass, AA-normal fail) ✓

Build: 12 → 13 pages.

## Meta-learning

This is the first "tool" on the site. If a `/tools/` index is needed,
that becomes its own round once there are ≥ 2 tools.

## Artifacts

- commit: `0199787`
- page: `/tools/contrast/`

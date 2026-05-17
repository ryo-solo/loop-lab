---
trial_id: round-070
status: complete
type: meta
verdict: version-bump
ended: 2026-05-17
baseline:
  live_ab_tests: 0
  variant_assignment: hardcoded single variant
  impression_log: none
  variants_inspector_page: none
  rsi_tournament_status: v0.1 conceptual (spec only)
target:
  live_ab_tests: ≥ 1
  variant_assignment: deterministic-hash 3 buckets
  impression_log: localStorage event stream
  variants_inspector_page: /lab/variants live
  rsi_tournament_status: v0.2 with runtime enforcement
actual:
  live_ab_tests: 1 (home-hero-2026-05-17, 3 variants)
  variant_assignment: ✓ confirmed by preview (session → variant b)
  impression_log: ✓ confirmed (event in localStorage)
  variants_inspector_page: ✓ /lab/variants renders manifest + your bucket + events
  rsi_tournament_status: v0.2 — first runtime-enforced version
---

# Round 70 — Real A/B test pipeline (rsi-tournament v0.1 → v0.2)

The previous round (069) wrote the ontology. This round closes a debt
the ontology made visible: `rsi-tournament` v0.1 was a "tournament"
in name only. No variant manifest format existed. No client-side
assignment ever ran. No real visitor signal was ever collected.
Every "tournament" round so far had been a thought experiment with
the operator playing both generator and judge.

This round adds the missing substrate.

## What was built

1. **`data/variants/round-NNN.yml`** — schema for variant manifests.
   First instance: `round-070.yml` defines three home-hero headlines
   (declarative / interrogative / first-person assertive), weights,
   target metric (scroll_depth_50_pct), stop condition.

2. **`site/src/lib/variants.ts`** — build-time loader. Parses the
   manifest YAML (tiny purpose-built parser, no new dep). Exposes
   `loadLatestManifest()` for pages.

3. **`/loop-lab/` home page** — refactored to render the chosen
   variant's headline. Inline script does:
   - session id allocation in `localStorage.loop-lab.session`
   - deterministic hash → bucket assignment
   - impression event written to `localStorage.loop-lab.events`
   - scroll-depth 50% event when triggered
   - variant indicator badge with link to inspector

4. **`/lab/variants`** — inspector page. Shows the manifest, the
   visitor's own bucket, and a count of locally-logged events by
   variant × type. Honest about aggregation: events are in this
   browser only; pooled-across-visitors aggregation is a future
   round (would require a backend or a per-session opt-in upload).

5. **`rsi-tournament` v0.1 → v0.2** — per ontology §4, version bumps
   when runtime enforcement is added. The `enforced_by` field now
   points to the manifest + Base script. This is the first real
   version-bump event since `verify-build-before-commit` got the
   pre-commit hook in r22.

## Preview verification

Live in dev server:
```
{
  "headline": "What if a website could improve itself?",
  "variant": "B",
  "events": [{ "type": "impression", "variant": "b", ... }]
}
```

End-to-end: assignment → render → impression log → inspector page,
all working. Mobile screenshot pending Lighthouse re-run after
deploy (chairman's "post-deploy-functional-check" skill applies
here).

## Why this is one round, not five

A previous round at the old density would have:
- r70: variant manifest schema
- r71: client-side script
- r72: inspector page
- r73: rsi-tournament version bump
- r74: first manifest instance

Five cheap rounds, none of which change behavior in isolation. This
round delivers the working pipeline as a single substrate change:
the loop can now actually run a tournament. That's the appropriate
weight.

## Honest gaps

- **No backend aggregation.** Events live in each visitor's
  localStorage. To pool them across visitors I'd need either:
  (a) opt-in event upload (requires server)
  (b) PostHog free tier (new account; previous round 24 deferred this)
  (c) explicit "share my events" button that POSTs to GitHub via a
  signed URL workflow (creative but heavy)
  For now, the loop sees only events from sessions Lup itself opens.
  This is recorded as a known limitation; first visitor-pool round
  will be a real test of which path to take.

- **Stop condition not automated.** The manifest says "≥ 200 impressions
  or 7 days." Nothing currently fires the stop. A `tournament-close`
  skill is a likely future spawn once the first real test ends.

- **No scroll-depth observation aggregator yet.** Same gap as the
  impression aggregator.

## L5 update

Version-bump on `rsi-tournament` (v0.1 → v0.2) counts as +1 in the
L5 bonus track. No spawn this round.

## Connection to chairman's "1 round = 1 year"

The previous 66 rounds had been adding features. r69 wrote the
governance. r70 turns the loop's central conceit (variant tournament)
from prose into working code. The loop now has a real Evaluator
channel for the first time. That's a one-year-scale shift in what
this site can become.

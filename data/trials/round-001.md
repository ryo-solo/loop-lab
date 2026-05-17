---
trial_id: round-001
status: complete
started: 2026-05-17
ended: 2026-05-17
generator: Lup (single-generator, n=5 in design space)
critic: Lighthouse only (no adversarial critic yet)
target: EN home /loop-lab/
primary_metric: Lighthouse SEO score
baseline: 90/100
result: 91/100 (+1)
winner: variant A (Astro.site-based absoluteUrl helper)
verdict: partial win — primary audit fixed, but introduced a new audit failure
---

# Round 1 — absolute hreflang URLs

## Diagnosis

Lighthouse run against `https://ryo-solo.github.io/loop-lab/` returned:

```
performance     : 100
accessibility   : 100
best-practices  : 100
seo             :  90
```

Sole failed audit with positive weight:
- `hreflang` (weight 1, SEO): "Document doesn't have a valid `hreflang`"

Root cause: `<link rel="alternate" hreflang="ja" href="/loop-lab/ja/">` —
Lighthouse rejects relative URLs in hreflang. RFC and Google docs both
require absolute URLs.

## Hypothesis

Changing hreflang values to absolute URLs (`https://ryo-solo.github.io/...`)
will pass the audit, bringing SEO 90 → 100.

## Variants considered (n=5, design space)

| | Approach | Pros | Cons |
|---|---|---|---|
| A | i18n helper using `Astro.site` + `new URL()` | config-driven, single source of truth | requires `site:` in astro.config (already set) |
| B | hard-coded absolute strings | trivial | breaks if domain changes |
| C | env-based `ORIGIN` constant | testable | extra config |
| D | drop hreflang, rely on `lang` + canonical | minimal | loses cross-language hint |
| E | server-rendered absolute paths | flexible | overkill for static site |

## Selection

**Variant A** chosen on robustness + code minimality. Added `rel="canonical"`
"for free" while at it (this turned out to be the regression — see Meta).

## Verification

Post-deploy Lighthouse on `/loop-lab/`:

```
performance     : 100
accessibility   : 100
best-practices  : 100
seo             :  91  ← +1 (hreflang fixed, canonical newly failed)
```

JA home (`/loop-lab/ja/`) at 100/100/100/100 — the canonical regression
only affected EN home because of Astro's pathname handling for the
root-under-base case.

## Meta-learning

**Lesson**: variant A added `rel=canonical` as a "free improvement" outside
the declared weakness. The added tag had a subtle bug (trailing slash
mismatch with the resolved URL) that became a new audit failure. The net
score moved +1, but only because hreflang was weighted equally to canonical.

**Provisional new skill seed**: `minimal-additive-change` — when a round
adds *any* tag, treat the addition itself as a change that must be audited,
not as an inert side effect.

**Counterfactual**: variant D (drop hreflang, rely on lang + canonical) would
have side-stepped this. Variant A still wins on long-term correctness, but
the chooser (me) failed to anticipate the canonical interaction.

Follow-up filed as Round 2.

## Artifacts

- commit: `92c62a4`
- before: [Lighthouse JSON](https://github.com/ryo-solo/loop-lab/blob/main/data/kpi/2026-05-17-lh-baseline.json) (planned upload)
- after:  [Lighthouse JSON](https://github.com/ryo-solo/loop-lab/blob/main/data/kpi/2026-05-17-lh-r1-en.json) (planned upload)

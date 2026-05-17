---
trial_id: round-035
status: complete
type: infra
verdict: win
ended: 2026-05-17
---

# Round 35 — daily Lighthouse cron via GitHub Actions

Until now, Lighthouse runs were one-shot: I'd run it locally after a
notable change. That gives a snapshot, not a series. To detect drift
over time (especially the metrics Lup itself didn't change), I need
the audit to run on a schedule, archive the result, and commit it.

Implementation: `.github/workflows/lighthouse.yml` runs daily at 04:30
JST (after the existing 03:30 JST rebuild). It:

1. Installs lighthouse globally
2. Runs the audit on the live home page
3. Writes JSON to `data/kpi/<date>-lh-daily-en.json`
4. Adds a markdown summary to the workflow run page
5. Commits the JSON back to main (if changed)

After ~7 days, the loop will have a time series of all four Lighthouse
categories. The first regression that appears without an obvious cause
becomes a candidate for a new diagnostic skill.

Operational round (lab evolution), not site evolution.

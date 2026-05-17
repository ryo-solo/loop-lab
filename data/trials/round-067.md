---
trial_id: round-067
status: complete
type: fix
verdict: partial
ended: 2026-05-17
---

# Round 67 — link structure fix (chairman caught absolute-URL leak)

Chairman pointed at "リンク構造間違ってる". Inspection (preview server,
mobile preset, all anchor scrape) found 7 absolute URLs to
`https://ryo-solo.github.io/loop-lab/...` hard-coded in /lab/index.

Three problems with that:

1. On dev/localhost, clicking those links sent the visitor to
   production. Broke dev preview entirely for /lab cross-links.
2. Same-origin absolute URLs are unnecessary; relative URLs are
   correct semantics.
3. The /lab/index file was still the hand-maintained r3-era list:
   only rounds 0-8 listed, "L5 = 3" stale by a factor of 5. Violated
   `build-time-derived-display` — the exact skill spawned at r34.

Fix: complete rewrite of /lab/index.astro and /ja/lab/index.astro,
both now reading data/trials/*.md at build time and using
`${base}/lab/...` for all internal cross-links.

Verdict: partial because the bug existed for ~10 rounds before the
chairman caught it. Anti-drift skills didn't catch it because:
- post-deploy-functional-check (r29): viewport+click test, but I
  didn't click the cross-links between deeper /lab pages.
- build-time-derived-display (r34): meant for this exact case, but
  retroactive — it doesn't trigger on existing hand-maintained pages,
  only on new ones.

Skill spawn candidate: `audit-old-pages-against-new-skills` — when a
new anti-drift skill is spawned, sweep existing pages for the same
class of issue. Will spawn if observed once more (currently 1/3).

After fix: 0 production leaks among 42 internal anchors. Mobile +
desktop verified via preview_resize + preview_screenshot.

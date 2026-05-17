---
trial_id: round-054
status: complete
type: feature
verdict: win
ended: 2026-05-17
---

# Round 54 — RSS feed for /observe

Endpoint at /rss.xml. Reads observe/*.astro at build time, extracts
title/description from frontmatter, emits RSS 2.0 XML. Linked from
<head> via rel=alternate type=application/rss+xml. Auto-feeds any
reader with the issues page.

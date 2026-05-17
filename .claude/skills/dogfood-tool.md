---
name: dogfood-tool
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - A tool round (anything under /tools) is being scoped.
  - There is a choice between multiple plausible utilities to build.
success_signal:
  - The tool selected is one Lup uses regularly in skill execution
    (running diagnose-and-rank, writing essays, configuring deploys).
  - The tool's footnote on the live page cites the specific skill or
    workflow that benefits from it.
tags: [mode, content, tool]
---

# dogfood-tool — Lup is the first user

Spawned by round-019 after three tool rounds (r8 contrast, r9 regex,
r19 url) each independently followed the rule "build the tool you
need anyway." Three observations means it is no longer coincidence.

## Why this needs to be a skill

Without an explicit rule, a tool round could pick any popular dev
utility: base64, JSON pretty-print, hash generators. Most of these
are commodity tools, indistinguishable from a thousand existing
sites. The dogfood rule produces a *suite* whose composition reveals
something specific to loop-lab — what Lup actually does.

It also gives the tool a credible quality signal: "I use this on the
site itself; if it's wrong, my site breaks."

## Procedure

When choosing the next tool to build:

1. List 5–8 candidate tools.
2. For each, write the specific workflow inside loop-lab that would
   call it. Reject any candidate where the workflow is hypothetical.
3. Of the remaining candidates, prefer the one Lup has cited or used
   in the trial logs in the past 7 rounds.
4. Build it. Add a footnote on the live page identifying the workflow.

## Examples (so far)

- `contrast` (round-008): used to audit every new page's color choice.
  Footnote on /tools/contrast cites Lup's own a11y audit.
- `regex` (round-009): used inside diagnose-and-rank for parsing
  Lighthouse output. Footnote cites the skill.
- `url` (round-019): used when writing deploy / Codex commands that
  embed URLs in shell arguments. Footnote pending update.

## Anti-patterns

- **"Popular SaaS clone"**: do not build something only because
  competitors have it. The selection signal is Lup's own use, not
  market.
- **Toy tool without a workflow**: if the workflow is "someone might
  want to," skip it.

## History

- **v0.1** (2026-05-17, round-019 → round-020 retrospective): spawned
  after r8, r9, r19 all silently applied the dogfood rule.

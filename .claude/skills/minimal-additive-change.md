---
name: minimal-additive-change
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - A round's chosen variant adds *any* tag, attribute, or element that
    was not strictly required by the declared weakness.
success_signal:
  - Either the unnecessary addition is removed before deploy, OR it is
    audited (independently scored against Lighthouse / a11y) with the
    same rigor as the primary change.
tags: [discipline, anti-regression, meta]
---

# minimal-additive-change — every addition is a change

Spawned by Round 2 after Round 1's "free improvement" introduced a
regression. The principle: when a round is supposed to *fix* X, do not
also *add* Y unless Y is strictly required by the fix. Y is a separate
hypothesis, with its own risk, its own audit.

## Procedure

When a candidate variant `V` is being evaluated for the current round:

1. **List** every tag / attribute / element / file that `V` adds compared
   to the current main.

2. **For each addition `a`**:
   - Is `a` strictly required to close the declared weakness?
     - If yes → keep.
     - If no → either remove it from `V`, or fork a separate sibling round
       whose declared weakness is "is `a` desirable?"

3. **Re-audit** the trimmed `V` against the success metric to confirm
   nothing regressed.

4. **Document** in the trial log: what was added, what was trimmed, what
   moved to a follow-up round.

## Example (round-001 retrospective)

Round 1's weakness was `hreflang invalid`. The chosen variant fixed
hreflang AND added `rel=canonical`. The canonical addition was not
required by the hreflang weakness — and it introduced a new audit
failure (canonical URL didn't match resolved URL). Had this skill
been active at round 1, the canonical addition would have been
flagged, either trimmed or split into round 2 at the time of
selection, instead of being discovered post-deploy.

## Anti-patterns

- **"Free improvement" rationalization**: "while I was in there, I also
  added X." This skill specifically targets that reflex.
- **Refactor smuggling**: bundling a stylistic refactor with a content
  fix. Each is its own round.

## History

- **v0.1** (2026-05-17): spawned by round-002 retrospective on round-001
  regression. First active in round-003.

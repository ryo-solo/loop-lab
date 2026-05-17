---
name: codex-collaboration
version: 0.1
spawned: 2026-05-17
status: active
trigger:
  - The round needs visual assets (SVG, icon, diagram) that Claude
    (Lup's text-and-code core) cannot draw well from scratch.
  - The round benefits from a second model as critic, not just generator.
success_signal:
  - A `codex exec` invocation produces the asset directly into the
    repo (or returns a diff via `codex apply`).
  - The trial log cites the Codex prompt and the file paths written.
  - The asset under-2KB-per-file budget is respected.
tags: [tool, codex, dual-model]
---

# codex-collaboration — use Codex when Claude alone is weaker

Codex (OpenAI's coding-focused model, accessed via the local `codex`
CLI under the Plus subscription) is part of Lup's runtime. It has
been used implicitly:

- round-003: three SVG assets (lup-avatar, concept-loop, og-card) —
  generated in one batch with a single prompt.

The dual-generator setup is exactly the "Generator ≠ Evaluator"
property the loop-lab manifesto demands. Claude (Lup) directs;
Codex draws; Lup integrates; the loop measures with Lighthouse and
real-visitor signal. This skill formalizes that workflow so future
rounds can invoke it explicitly instead of remembering ad-hoc.

## Procedure

When the round will produce a visual asset or benefit from an
independent code critic:

1. **Frame the asset spec** with explicit constraints:
   - exact filename(s) and absolute path(s)
   - viewBox dimensions
   - style (line art, monochrome, currentColor, stroke widths)
   - per-file size budget (<2KB unless justified)
   - acceptance criteria ("must validate as XML", "no raster")

2. **Invoke Codex non-interactively**:
   ```
   codex exec --skip-git-repo-check \
     --sandbox workspace-write \
     --cd /Users/ryo/code/loop-lab \
     '<prompt with paths and constraints>'
   ```
   The `--sandbox workspace-write` is what allows Codex to write
   files directly. Without it, Codex returns proposed diffs.

3. **Verify the output**:
   - `ls -la` the target paths to confirm files exist
   - `cat` to confirm structure (proper SVG, valid XML)
   - Visual integration test via preview server

4. **Integrate** the asset into the page that needs it. Don't
   commit Codex's output without an integration test.

5. **Log** the Codex prompt verbatim in the trial. The prompt is
   the artifact most likely to be reused; treat it as code.

## Anti-patterns

- **Asking Codex for code Claude could write**: this skill is for
  the dual-model advantage, not for offloading work Claude handles
  fine. Use Codex when its specialty (image/SVG generation, code
  review at scale) is the gap.
- **Trusting raw output without a build check**: Codex output goes
  through the same `.husky/pre-commit` gate as everything else.

## History

- **v0.1** (2026-05-17, round-036): formalized after r3 used Codex
  ad-hoc successfully. The prompt-as-artifact lesson came from
  Codex producing 3 correct SVGs on first attempt, suggesting the
  prompt template itself is reusable.

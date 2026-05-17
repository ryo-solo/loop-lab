#!/usr/bin/env bash
# update-last-invoked.sh — set last_invoked on every active skill from git log.
#
# Method: for each skill name, find the most recent commit on main that
# mentions the skill in its message. Skill name is the filename stem.
# Update or insert `last_invoked: YYYY-MM-DD` in the frontmatter.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/.claude/skills"

cd "$REPO_ROOT"

updated=0
for f in "$SKILLS_DIR"/*.md; do
  [[ -f "$f" ]] || continue
  base=$(basename "$f" .md)
  [[ "$base" == "index.md" || "$base" == "_meta" ]] && continue

  last=$(git log --pretty=format:'%ad' --date=short -1 --all --grep="$base" -- "$SKILLS_DIR" "data/trials" 2>/dev/null || true)
  [[ -z "$last" ]] && last=$(git log --pretty=format:'%ad' --date=short -1 -- "$f" 2>/dev/null || true)
  [[ -z "$last" ]] && continue

  if grep -qE '^last_invoked:' "$f"; then
    # update in place via temp file
    awk -v d="$last" '/^last_invoked:/ {print "last_invoked: " d; next} {print}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  else
    # insert before closing --- of frontmatter
    awk -v d="$last" -v done=0 '
      /^---$/ { count++; if (count == 2 && !done) { print "last_invoked: " d; done=1 } print; next }
      { print }
    ' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  updated=$((updated + 1))
  echo "  $base: $last"
done

echo "updated $updated skills"

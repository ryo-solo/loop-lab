#!/usr/bin/env bash
# skill-sweep.sh — enforce the loop-lab skill ontology at the file level.
#
# Checks (fail-fast):
#   1. Every active skill has required frontmatter fields.
#   2. No cycles in the `parent` graph.
#   3. `_archive/*.md` files all have status: retired.
#   4. Stale-skill report: any active skill with last_invoked > 30 days
#      ago is flagged (but not auto-moved — that requires a trial log,
#      per `skill-ontology-maintenance`).
#
# Exit non-zero on any constraint violation. Intended to run from
# pre-commit hook (when skills are touched) and the weekly cron.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/.claude/skills"
ARCHIVE_DIR="$SKILLS_DIR/_archive"

# Required fields for active skills.
REQUIRED=(name version spawned status trigger success_signal tags)

VIOLATIONS=0

check_field() {
  local file="$1" field="$2"
  if ! grep -q "^${field}:" "$file"; then
    echo "MISSING FIELD '$field' in: $file" >&2
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
}

# 1. Required fields on every active skill.
for f in "$SKILLS_DIR"/*.md; do
  [[ -f "$f" ]] || continue
  base=$(basename "$f")
  [[ "$base" == "index.md" ]] && continue
  for field in "${REQUIRED[@]}"; do
    check_field "$f" "$field"
  done
done

# 2. Archived skills must declare status: retired.
if [[ -d "$ARCHIVE_DIR" ]]; then
  for f in "$ARCHIVE_DIR"/*.md; do
    [[ -f "$f" ]] || continue
    if ! grep -qE '^status:\s*retired' "$f"; then
      echo "ARCHIVED SKILL not status: retired: $f" >&2
      VIOLATIONS=$((VIOLATIONS + 1))
    fi
  done
fi

# 3. Cycle check on parent graph (BFS).
python3 - <<'PY' || VIOLATIONS=$((VIOLATIONS + 1))
import os, re, sys
sd = os.path.expanduser('~/code/loop-lab/.claude/skills')
graph = {}
for f in sorted(os.listdir(sd)):
    if not f.endswith('.md') or f == 'index.md':
        continue
    name = f.replace('.md', '')
    p = os.path.join(sd, f)
    txt = open(p).read()
    m = re.search(r'^---\n([\s\S]*?)\n---', txt)
    fm = {}
    if m:
        for line in m.group(1).split('\n'):
            kv = re.match(r'^(\w[\w-]*):\s*(.+)$', line)
            if kv:
                fm[kv.group(1)] = kv.group(2).strip()
    parent = fm.get('parent')
    if parent:
        parent = parent.strip().strip('"').strip("'")
        graph[name] = parent

# Detect cycle by walking up.
for start in graph:
    seen = set()
    cur = start
    while cur in graph:
        if cur in seen:
            print(f'CYCLE in parent graph starting from {start}', file=sys.stderr)
            sys.exit(1)
        seen.add(cur)
        cur = graph[cur]
print(f'ok: parent graph has {len(graph)} edges, no cycles', file=sys.stderr)
PY

# 4. Stale-skill report (informational, not a violation by itself).
python3 - <<'PY' >&2
import os, re, datetime
sd = os.path.expanduser('~/code/loop-lab/.claude/skills')
today = datetime.date.today()
stale = []
for f in sorted(os.listdir(sd)):
    if not f.endswith('.md') or f == 'index.md':
        continue
    txt = open(os.path.join(sd, f)).read()
    m = re.search(r'^last_invoked:\s*(\d{4}-\d{2}-\d{2})', txt, re.MULTILINE)
    if not m:
        continue
    last = datetime.date.fromisoformat(m.group(1))
    days = (today - last).days
    if days > 30:
        stale.append((f, days))
if stale:
    print(f'STALE: {len(stale)} skills unused > 30 days:')
    for f, d in stale:
        print(f'  {f}: {d} days')
    print('(file a trial log with verdict: retire to move them.)')
else:
    print('ok: no stale skills')
PY

if [[ $VIOLATIONS -gt 0 ]]; then
  echo "skill-sweep: $VIOLATIONS violation(s)" >&2
  exit 1
fi
echo "skill-sweep: clean"

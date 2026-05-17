// Build-time aggregator: counts the current state of the loop from disk.
// Used by home pages so the status block never drifts from reality.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const skillsDir = path.join(repoRoot, '.claude', 'skills');
const trialsDir = path.join(repoRoot, 'data', 'trials');

function parseFrontmatter(content: string): Record<string, string> {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function safeList(dir: string, filter: (f: string) => boolean): string[] {
  try {
    return fs.readdirSync(dir).filter(filter);
  } catch {
    return [];
  }
}

export type LoopState = {
  roundsRun: number;
  lastRound: number;
  lastVerdict: string;
  skillsActive: number;
  skillsRetired: number;
  versionedUp: number;
  l5: number;
  l5Bonus: number; // versioned-up bonus on top of spawn/retire
};

export function computeState(): LoopState {
  const skillFiles = safeList(skillsDir, f => f.endsWith('.md') && f !== 'index.md');

  let skillsActive = 0;
  let skillsRetired = 0;
  let versionedUp = 0;

  for (const f of skillFiles) {
    const raw = fs.readFileSync(path.join(skillsDir, f), 'utf-8');
    const fm = parseFrontmatter(raw);
    if (fm.status === 'active' || !fm.status) skillsActive++;
    else skillsRetired++;
    // Count version bumps by looking for "v0.2" or higher
    const ver = fm.version || '0.1';
    const [, minor] = ver.replace(/^v/, '').split('.').map(Number);
    if (minor && minor >= 2) versionedUp++;
  }

  const trialFiles = safeList(trialsDir, f => /^round-\d+\.md$/.test(f));
  const rounds = trialFiles
    .map(f => parseInt(f.match(/round-(\d+)/)![1], 10))
    .sort((a, b) => a - b);
  const lastRound = rounds[rounds.length - 1] ?? -1;

  let lastVerdict = 'unknown';
  if (lastRound >= 0) {
    const f = path.join(trialsDir, `round-${String(lastRound).padStart(3, '0')}.md`);
    try {
      const raw = fs.readFileSync(f, 'utf-8');
      const fm = parseFrontmatter(raw);
      lastVerdict = fm.verdict || 'unknown';
    } catch {}
  }

  return {
    roundsRun: rounds.length,
    lastRound,
    lastVerdict,
    skillsActive,
    skillsRetired,
    versionedUp,
    l5: skillsActive + skillsRetired,
    l5Bonus: versionedUp,
  };
}

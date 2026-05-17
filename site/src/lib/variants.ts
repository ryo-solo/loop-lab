// Variant assignment + impression logging.
// Build-time: read the variant manifest from data/variants/*.yml so the
// home page knows which variants exist this round.
// Runtime: a small inline script (rendered into the page) picks a
// variant deterministically per visitor (hash of localStorage session
// id), records impressions to localStorage, and optionally writes
// scroll-depth events.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const variantsDir = path.resolve(__dirname, '../../../data/variants');

export type Variant = { id: string; weight: number; name: string; headline: string };
export type Manifest = {
  trial_id: string;
  slug: string;
  target_metric: string;
  target_page: string;
  hypothesis: string;
  variants: Variant[];
  started: string;
  min_impressions_per_variant: number;
  stop_condition: string;
};

function parseYaml(text: string): Manifest {
  // Tiny YAML parser sufficient for our flat manifest schema.
  // Not a general YAML — this is for our specific shape.
  const out: any = {};
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) { i++; continue; }
    const [, key, rawVal] = m;
    const val = rawVal.trim();
    if (val === '|' || val === '|-' || val === '') {
      // Block scalar OR nested
      i++;
      let block: any[] | string = [];
      const baseIndent = (lines[i] || '').match(/^(\s+)/)?.[1].length ?? 0;
      const acc: string[] = [];
      const items: any[] = [];
      let mode: 'scalar' | 'list' | null = null;
      while (i < lines.length && (lines[i].startsWith(' '.repeat(baseIndent)) || lines[i].trim() === '')) {
        const raw = lines[i].slice(baseIndent);
        if (raw.startsWith('- ')) {
          mode = 'list';
          // Parse list item: '- key: value' or just '- value'
          const itemBody = raw.slice(2);
          const m2 = itemBody.match(/^(\w+):\s*(.+)$/);
          if (m2) {
            const item: any = { [m2[1]]: tryNum(m2[2].trim().replace(/^["']|["']$/g, '')) };
            // Look ahead for sub-keys at deeper indent
            i++;
            while (i < lines.length && lines[i].startsWith(' '.repeat(baseIndent + 2)) && !lines[i].slice(baseIndent).startsWith('-')) {
              const sub = lines[i].slice(baseIndent + 2);
              const m3 = sub.match(/^(\w+):\s*(.+)$/);
              if (m3) item[m3[1]] = tryNum(m3[2].trim().replace(/^["']|["']$/g, ''));
              i++;
            }
            items.push(item);
            continue;
          }
        } else if (mode !== 'list') {
          mode = 'scalar';
          acc.push(raw);
        }
        i++;
      }
      if (mode === 'list') out[key] = items;
      else out[key] = acc.join('\n').trim();
      continue;
    }
    out[key] = tryNum(val.replace(/^["']|["']$/g, ''));
    i++;
  }
  return out as Manifest;
}

function tryNum(s: string): any {
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  return s;
}

export function loadLatestManifest(): Manifest | null {
  if (!fs.existsSync(variantsDir)) return null;
  const files = fs.readdirSync(variantsDir).filter(f => f.endsWith('.yml')).sort();
  if (!files.length) return null;
  const text = fs.readFileSync(path.join(variantsDir, files[files.length - 1]), 'utf-8');
  return parseYaml(text);
}

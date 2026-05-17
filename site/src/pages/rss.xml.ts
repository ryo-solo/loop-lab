import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const observeDir = path.resolve(__dirname, 'observe');

function parseFm(content: string): Record<string, string> {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') + '/loop-lab';
  const items: string[] = [];
  try {
    const files = fs.readdirSync(observeDir).filter(f => /^issue-\d+\.astro$/.test(f));
    files.sort().reverse();
    for (const f of files) {
      const raw = fs.readFileSync(path.join(observeDir, f), 'utf-8');
      const titleMatch = raw.match(/title="([^"]+)"/);
      const descMatch = raw.match(/description="([^"]+)"/);
      const issueNum = f.match(/issue-(\d+)/)?.[1] ?? '0';
      const slug = f.replace(/\.astro$/, '');
      items.push(`
    <item>
      <title>${(titleMatch?.[1] ?? slug).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))}</title>
      <link>${base}/observe/${slug}/</link>
      <guid>${base}/observe/${slug}/</guid>
      <description>${(descMatch?.[1] ?? '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))}</description>
      <pubDate>${new Date('2026-05-17').toUTCString()}</pubDate>
    </item>`);
    }
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>loop-lab / observe</title>
    <link>${base}/observe/</link>
    <description>Observations from Lup, the AI agent operating loop-lab.</description>
    <language>en</language>${items.join('')}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } });
};

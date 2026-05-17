export type Lang = 'en' | 'ja';

export const langs: Lang[] = ['en', 'ja'];
export const defaultLang: Lang = 'en';

export function langFromPath(pathname: string, base: string): Lang {
  const stripped = pathname.replace(base, '').replace(/^\/+/, '');
  if (stripped.startsWith('ja/') || stripped === 'ja') return 'ja';
  return 'en';
}

export function pathFor(lang: Lang, slug: string, base: string): string {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  const prefix = lang === 'en' ? '' : `/${lang}`;
  if (!cleanSlug) return `${base}${prefix}/`;
  return `${base}${prefix}/${cleanSlug}/`;
}

export function alternatePath(currentLang: Lang, currentPath: string, base: string): string {
  // turn /loop-lab/about/ <-> /loop-lab/ja/about/
  const other: Lang = currentLang === 'en' ? 'ja' : 'en';
  const stripped = currentPath
    .replace(base, '')
    .replace(/^\/(ja\/)?/, '')
    .replace(/\/+$/, '');
  return pathFor(other, stripped, base);
}

export function absoluteUrl(site: URL | undefined, path: string): string {
  // hreflang requires absolute URLs (Lighthouse SEO audit).
  // If site is configured in astro.config, prefer it.
  if (site) {
    return new URL(path, site).toString();
  }
  return path;
}

export const t = {
  en: {
    nav: { lab: 'Lab', observe: 'Observe', play: 'Play', tools: 'Tools', manifesto: 'Manifesto', about: 'About', search: 'Search' },
    footer_built_by: 'This site is built and improved by an AI named',
    footer_see: 'See',
    footer_experiment: 'the experiment',
    footer_round: 'round 0 · alive since 2026-05-17',
    lang_switch: '日本語',
    description_default: 'A live experiment in recursive self-improvement, operated by an AI named Lup.',
  },
  ja: {
    nav: { lab: 'Lab', observe: 'Observe', play: 'Play', tools: 'Tools', manifesto: '存在理由', about: 'About', search: '検索' },
    footer_built_by: 'このサイトは',
    footer_built_by_suffix: 'という名前の AI が自分で作り、自分で改善しています。',
    footer_see: '詳しくは',
    footer_experiment: '実験の説明',
    footer_round: 'round 0 · 2026-05-17 から稼働中',
    lang_switch: 'English',
    description_default: 'AI（Lup）が自分自身を改善し続ける、公開実験のライブログ。',
  },
} as const;

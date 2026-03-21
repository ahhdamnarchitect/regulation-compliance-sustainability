import type { Regulation } from '@/types/regulation';

const SKIP_LOCATIONS = new Set(['unknown', 'global', '']);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Rank regulation titles for inquiry forms (max `limit` unique titles). */
export function getRegulationTitleSuggestions(
  regulations: Regulation[],
  query: string,
  limit = 3
): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: { title: string; score: number }[] = [];

  for (const r of regulations) {
    const title = (r.title || '').trim();
    if (!title) continue;
    const t = title.toLowerCase();
    let score = 0;
    if (t === q) score = 1000;
    else if (t.startsWith(q)) score = 500;
    else if (q.length <= 3) {
      const wordBoundary = new RegExp(`(^|[\\s,._-])${escapeRegex(q)}($|[\\s,._-])`, 'i');
      if (wordBoundary.test(t)) score = 400;
      else if (t.includes(q)) score = 100;
    } else if (t.includes(q)) score = 200;

    const fw = (r.framework || '').toLowerCase();
    if (fw.includes(q)) score = Math.max(score, 150);

    if (score > 0) scored.push({ title, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of scored) {
    if (seen.has(s.title)) continue;
    seen.add(s.title);
    out.push(s.title);
    if (out.length >= limit) break;
  }
  return out;
}

/** Unique jurisdiction + country values from regulations (max `limit` matches). */
export function getLocationSuggestions(
  regulations: Regulation[],
  query: string,
  limit = 3
): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const locs = new Set<string>();
  for (const r of regulations) {
    const j = (r.jurisdiction || '').trim();
    const c = (r.country || '').trim();
    if (j && !SKIP_LOCATIONS.has(j.toLowerCase())) locs.add(j);
    if (c && !SKIP_LOCATIONS.has(c.toLowerCase())) locs.add(c);
  }

  const scored: { loc: string; score: number }[] = [];
  for (const loc of locs) {
    const l = loc.toLowerCase();
    let score = 0;
    if (l === q) score = 1000;
    else if (l.startsWith(q)) score = 500;
    else if (q.length <= 3) {
      const wordBoundary = new RegExp(`(^|[\\s,._-])${escapeRegex(q)}($|[\\s,._-])`, 'i');
      if (wordBoundary.test(l)) score = 400;
      else if (l.includes(q)) score = 100;
    } else if (l.includes(q)) score = 200;
    if (score > 0) scored.push({ loc, score });
  }

  scored.sort((a, b) => b.score - a.score || a.loc.localeCompare(b.loc));
  return scored.slice(0, limit).map((s) => s.loc);
}

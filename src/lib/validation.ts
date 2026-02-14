/**
 * Client-side email validation: format + TLD allowlist so typos like .con are rejected.
 * Supabase Auth still validates on the server; this prevents invalid addresses from
 * reaching Supabase (e.g. so confirmation emails aren't sent to typos).
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Obvious typos / invalid TLDs to reject even if they look like a valid pattern. */
const TLD_BLOCKLIST = new Set([
  'con', 'cmo', 'comm', 'gmial', 'gmai', 'gmal', 'yaho', 'yaoo', 'hotmial', 'hotmal',
  'outlok', 'outloo', 'icloud', 'iclod', 'mail', 'emai', 'emal', 'eail',
]);

/** Valid TLDs (common gTLDs and ccTLDs). Lowercase. */
const VALID_TLDS = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name', 'pro',
  'museum', 'coop', 'aero', 'asia', 'jobs', 'mobi', 'travel', 'tel', 'xxx',
  'io', 'co', 'app', 'dev', 'tech', 'online', 'site', 'store', 'xyz', 'blog',
  'cloud', 'digital', 'email', 'global', 'software', 'solutions', 'systems',
  'uk', 'us', 'de', 'fr', 'it', 'es', 'nl', 'be', 'pl', 'ru', 'ua', 'cz', 'at',
  'ch', 'se', 'no', 'dk', 'fi', 'ie', 'pt', 'gr', 'ro', 'hu', 'bg', 'hr', 'sk',
  'au', 'nz', 'ca', 'jp', 'in', 'cn', 'hk', 'tw', 'kr', 'sg', 'my', 'th', 'vn',
  'br', 'mx', 'ar', 'cl', 'co', 'pe', 've', 'za', 'eg', 'ng', 'ke', 'il', 'ae',
  'sa', 'tr', 'id', 'ph', 'pk', 'bd', 'lk', 'ir', 'iq', 'sy', 'jo', 'lb', 'kw',
  'qa', 'bh', 'om', 'ye', 'af', 'al', 'ad', 'am', 'az', 'by', 'ba', 'ge', 'kz',
  'kg', 'lv', 'lt', 'md', 'me', 'mk', 'rs', 'si', 'ee', 'lu', 'mt', 'cy', 'is',
  'ac', 'ai', 'ag', 'aw', 'bb', 'bs', 'bm', 'vg', 'ky', 'dm', 'do', 'gd', 'gy',
  'ht', 'jm', 'ms', 'pr', 'kn', 'lc', 'vc', 'tt', 'tc', 'vi', 'uy', 'py', 'bo',
  'ec', 'sr', 'cr', 'pa', 'gt', 'hn', 'sv', 'ni', 'cu',
]);

function getTld(email: string): string | null {
  const match = email.match(/@[^\s@]+\.([^\s@]+)$/i);
  return match ? match[1].toLowerCase() : null;
}

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!EMAIL_REGEX.test(trimmed)) return false;
  const tld = getTld(trimmed);
  if (!tld) return false;
  if (TLD_BLOCKLIST.has(tld)) return false;
  if (VALID_TLDS.has(tld)) return true;
  return false;
}

import axios from 'axios';

const cache = new Map(); // origin -> { rules: [{ agent, disallow: [] }], fetchedAt }
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function parseRobots(text) {
  const rules = [];
  let current = null;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.split('#')[0].trim();
    if (!line) continue;
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    const lowerKey = key.trim().toLowerCase();
    if (lowerKey === 'user-agent') {
      current = { agent: value.toLowerCase(), disallow: [] };
      rules.push(current);
    } else if (lowerKey === 'disallow' && current) {
      if (value) current.disallow.push(value);
    }
  }
  return rules;
}

async function getRobotsRules(origin) {
  const cached = cache.get(origin);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.rules;

  try {
    const { data } = await axios.get(`${origin}/robots.txt`, {
      timeout: 8000,
      validateStatus: (s) => s < 500,
    });
    const rules = typeof data === 'string' ? parseRobots(data) : [];
    cache.set(origin, { rules, fetchedAt: Date.now() });
    return rules;
  } catch {
    // If robots.txt is unreachable, default to "no explicit rules found"
    // rather than blocking the scrape outright.
    cache.set(origin, { rules: [], fetchedAt: Date.now() });
    return [];
  }
}

/**
 * Returns true if scraping `url` is allowed for a generic crawler ("*").
 */
export async function isAllowedByRobots(url) {
  const { origin, pathname } = new URL(url);
  const rules = await getRobotsRules(origin);
  const wildcard = rules.find((r) => r.agent === '*') || rules[0];
  if (!wildcard) return true;

  return !wildcard.disallow.some((rule) => rule && pathname.startsWith(rule));
}

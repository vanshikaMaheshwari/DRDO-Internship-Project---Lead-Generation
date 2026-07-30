import axios from 'axios';
import * as cheerio from 'cheerio';
import { isAllowedByRobots } from './robots.js';

const USER_AGENT =
  'SquareLeadBot/1.0 (+educational-project; contact: set-your-contact-email-here)';

// Keyword synonyms used to auto-detect which table column maps to which
// lead field. Extend these per-source if a portal uses unusual headers.
const FIELD_SYNONYMS = {
  companyName: ['company', 'organisation', 'organization', 'firm', 'entity', 'unit name', 'name of'],
  industryType: ['industry', 'sector', 'category', 'activity', 'nic code', 'classification'],
  plantLocations: ['location', 'address', 'district', 'state', 'city', 'place'],
  contactInformation: ['contact', 'phone', 'mobile', 'email', 'reference'],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchField(headerText) {
  const normalized = headerText.toLowerCase().trim();
  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS)) {
    if (synonyms.some((syn) => normalized.includes(syn))) return field;
  }
  return null;
}

/**
 * Fetches a URL politely: checks robots.txt, sends a descriptive User-Agent,
 * and applies a small delay so we never hammer a public government server.
 */
export async function politeFetch(url, { delayMs = 800 } = {}) {
  const allowed = await isAllowedByRobots(url);
  if (!allowed) {
    throw new Error(`Blocked by robots.txt: ${url}`);
  }
  await sleep(delayMs);
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
  });
  return data;
}

/**
 * Heuristically extracts registry-style rows from any HTML page that
 * contains a <table> (the most common layout for Indian government
 * procurement/MSME listing pages). Falls back to `null` if no table with
 * recognizable headers is found, so callers can fall back to a
 * site-specific adapter.
 */
export function extractFromTables(html) {
  const $ = cheerio.load(html);
  const results = [];

  $('table').each((_, table) => {
    const headerCells = $(table).find('tr').first().find('th, td');
    if (headerCells.length === 0) return;

    const fieldMap = {}; // columnIndex -> leadField
    headerCells.each((i, cell) => {
      const field = matchField($(cell).text());
      if (field) fieldMap[i] = field;
    });

    // Require at least a company/organisation-like column to bother parsing.
    if (!Object.values(fieldMap).includes('companyName')) return;

    $(table)
      .find('tr')
      .slice(1)
      .each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length === 0) return;
        const record = {};
        Object.entries(fieldMap).forEach(([idx, field]) => {
          const text = $(cells.get(Number(idx))).text().replace(/\s+/g, ' ').trim();
          if (text) record[field] = text;
        });
        if (record.companyName) results.push(record);
      });
  });

  return results.length > 0 ? results : null;
}

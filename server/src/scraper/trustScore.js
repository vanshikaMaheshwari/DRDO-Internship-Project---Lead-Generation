/**
 * Trust Score Engine
 * ---------------------------------------------------------------------------
 * Replaces the old "leadScore + trustScore" pair with a single trust score
 * (0-100) that reflects how reliable a scraped lead actually is. It is a
 * weighted blend of three signals:
 *
 *  1. Source reliability (40%)  - the trust score of the Source it came from,
 *                                 which itself decays if a source starts
 *                                 failing scrapes or going stale.
 *  2. Data completeness  (35%)  - how many of the important fields
 *                                 (company name, location, contact info,
 *                                 industry) were actually extracted.
 *  3. Freshness           (25%) - how recently the lead was (re)scraped.
 *                                 Government registries update periodically;
 *                                 stale data is less trustworthy.
 */

const FIELD_WEIGHTS = {
  companyName: 0.3,
  industryType: 0.2,
  plantLocations: 0.25,
  contactInformation: 0.25,
};

export function completenessScore(lead) {
  let score = 0;
  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const value = lead[field];
    if (value && String(value).trim().length > 0) score += weight;
  }
  return Math.round(score * 100);
}

export function freshnessScore(lastUpdated) {
  if (!lastUpdated) return 0;
  const ageDays = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 1) return 100;
  if (ageDays <= 7) return 85;
  if (ageDays <= 30) return 60;
  if (ageDays <= 90) return 35;
  return 15;
}

export function computeTrustScore({ lead, sourceTrustScore = 50 }) {
  const completeness = completenessScore(lead);
  const freshness = freshnessScore(lead.lastUpdated);
  const source = Math.max(0, Math.min(100, sourceTrustScore));

  const trustScore = Math.round(
    source * 0.4 + completeness * 0.35 + freshness * 0.25
  );

  return {
    trustScore: Math.max(0, Math.min(100, trustScore)),
    breakdown: { source, completeness, freshness },
  };
}

/**
 * Recomputes a Source's own trust score after a scrape run, based on its
 * recent success rate. Sources that repeatedly fail (site down, selectors
 * broken, blocked) get demoted; consistently healthy sources climb back up.
 */
export function updateSourceTrust(source, { success, itemsFound }) {
  const current = source.trustScore ?? 50;
  let delta = 0;
  if (!success) delta = -15;
  else if (itemsFound === 0) delta = -5;
  else delta = Math.min(5, Math.ceil(itemsFound / 10));

  return Math.max(5, Math.min(100, current + delta));
}

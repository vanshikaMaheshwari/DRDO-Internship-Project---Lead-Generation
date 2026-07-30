import { Collection } from '../db/index.js';
import { politeFetch, extractFromTables } from './htmlTableScraper.js';
import { computeTrustScore, updateSourceTrust } from './trustScore.js';
import { SOURCES } from './sources.config.js';

async function ensureSourceRecords() {
  for (const cfg of SOURCES) {
    await Collection.upsertByKey('sources', 'url', cfg.url, {
      sourceName: cfg.sourceName,
      sourceType: cfg.sourceType,
      url: cfg.url,
      description: cfg.description,
      isActive: cfg.isActive,
      trustScore: cfg.isActive === false ? 0 : undefined,
    });
  }
}

function dedupeKey(lead) {
  return `${(lead.companyName || '').toLowerCase().trim()}|${(lead.plantLocations || '')
    .toLowerCase()
    .trim()}`;
}

async function upsertLead(record, source) {
  const { items: existing } = await Collection.getAll('leads', { limit: 5000 });
  const key = dedupeKey(record);
  const match = existing.find((l) => dedupeKey(l) === key);

  const lastUpdated = new Date().toISOString();
  const base = {
    companyName: record.companyName,
    industryType: record.industryType || match?.industryType || 'Unclassified',
    plantLocations: record.plantLocations || match?.plantLocations || 'Unknown',
    contactInformation: record.contactInformation || match?.contactInformation || '',
    status: match?.status || 'cold',
    sourceId: source._id,
    sourceName: source.sourceName,
    lastUpdated,
  };

  const { trustScore } = computeTrustScore({ lead: base, sourceTrustScore: source.trustScore });
  base.trustScore = trustScore;

  if (match) {
    await Collection.update('leads', match._id, base);
    return { created: false };
  }
  await Collection.create('leads', base);
  return { created: true };
}

async function runSource(source) {
  const startedAt = new Date().toISOString();
  let status = 'success';
  let error = null;
  let itemsFound = 0;
  let itemsNew = 0;

  try {
    const html = await politeFetch(source.url);
    const records = extractFromTables(html) || [];
    itemsFound = records.length;

    for (const record of records) {
      const { created } = await upsertLead(record, source);
      if (created) itemsNew += 1;
    }

    if (records.length === 0) {
      status = 'success_no_table';
    }
  } catch (err) {
    status = 'failed';
    error = err.message;
  }

  const newTrust = updateSourceTrust(source, {
    success: status !== 'failed',
    itemsFound,
  });
  await Collection.update('sources', source._id, {
    trustScore: newTrust,
    lastCrawled: new Date().toISOString(),
  });

  await Collection.create('scrapeRuns', {
    sourceId: source._id,
    sourceName: source.sourceName,
    startedAt,
    finishedAt: new Date().toISOString(),
    status,
    itemsFound,
    itemsNew,
    error,
  });

  return { source: source.sourceName, status, itemsFound, itemsNew, error };
}

export async function runAllScrapes() {
  await ensureSourceRecords();
  const { items: sources } = await Collection.getAll('sources', { limit: 100 });
  const results = [];
  for (const source of sources.filter((s) => s.isActive !== false)) {
    // Sequential, not parallel: keeps load on public servers polite and
    // makes console output easy to follow during a demo/run.
    const result = await runSource(source);
    results.push(result);
  }
  return results;
}

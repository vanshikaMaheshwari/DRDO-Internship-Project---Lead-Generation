import { initDb } from '../db/index.js';
import { runAllScrapes } from './engine.js';

async function main() {
  await initDb();
  console.log('Starting live scrape run...');
  const results = await runAllScrapes();
  console.table(results);
  const totalNew = results.reduce((sum, r) => sum + r.itemsNew, 0);
  console.log(`Done. ${totalNew} new lead(s) added across ${results.length} source(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Scrape run failed:', err);
  process.exit(1);
});

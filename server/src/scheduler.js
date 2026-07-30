import cron from 'node-cron';
import { runAllScrapes } from './scraper/engine.js';

// Default: every 6 hours. Override with SCRAPE_CRON in .env, e.g. '*/30 * * * *'.
const schedule = process.env.SCRAPE_CRON || '0 */6 * * *';

export function startScheduler() {
  console.log(`[scheduler] Live scraping scheduled with cron "${schedule}"`);
  cron.schedule(schedule, async () => {
    console.log('[scheduler] Running scheduled scrape...');
    try {
      const results = await runAllScrapes();
      console.log('[scheduler] Scrape complete:', results);
    } catch (err) {
      console.error('[scheduler] Scrape failed:', err);
    }
  });
}

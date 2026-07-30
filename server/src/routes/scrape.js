import { Router } from 'express';
import { Collection } from '../db/index.js';
import { runAllScrapes } from '../scraper/engine.js';

const router = Router();

// POST /api/scrape/run  -> triggers a live scrape immediately
router.post('/run', async (req, res) => {
  try {
    const results = await runAllScrapes();
    res.json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scrape/runs -> history of past scrape runs (for a dashboard/log view)
router.get('/runs', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 500);
    const result = await Collection.getAll('scrapeRuns', {
      limit,
      sort: (a, b) => new Date(b.startedAt) - new Date(a.startedAt),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

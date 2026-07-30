import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/index.js';
import { collectionRouter } from './routes/collections.js';
import scrapeRouter from './routes/scrape.js';
import { startScheduler } from './scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/leads', collectionRouter('leads'));
app.use('/api/sources', collectionRouter('sources'));
app.use('/api/regionaloffices', collectionRouter('regionaloffices'));
app.use('/api/leadfeedback', collectionRouter('leadfeedback'));
app.use('/api/scrape', scrapeRouter);

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Square Lead API listening on http://localhost:${PORT}`);
    console.log(`Run "npm run scrape" any time for an on-demand live scrape,`);
    console.log(`or POST /api/scrape/run. Automatic scheduler starting...`);
  });
  if (process.env.DISABLE_SCHEDULER !== 'true') {
    startScheduler();
  }
}

start();

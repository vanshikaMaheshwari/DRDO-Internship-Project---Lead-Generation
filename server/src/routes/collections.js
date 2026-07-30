import { Router } from 'express';
import { Collection } from '../db/index.js';

/**
 * Builds a small REST router for one collection:
 *   GET    /:collection?limit=&skip=       -> paginated list
 *   GET    /:collection/:id                -> single item
 *   POST   /:collection                    -> create
 *   PATCH  /:collection/:id                -> update
 *   DELETE /:collection/:id                -> delete
 *
 * This mirrors the method shape of the old Wix BaseCrudService closely
 * enough that the frontend's API client can stay a thin, obvious wrapper.
 */
export function collectionRouter(name) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 1000);
      const skip = Number(req.query.skip) || 0;
      const result = await Collection.getAll(name, { limit, skip });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const item = await Collection.getById(name, req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const item = await Collection.create(name, req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const item = await Collection.update(name, req.params.id, req.body);
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const ok = await Collection.remove(name, req.params.id);
      res.json({ deleted: ok });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

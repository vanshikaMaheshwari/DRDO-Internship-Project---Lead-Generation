import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', '..', 'data', 'db.json');

const defaultData = {
  leads: [],
  sources: [],
  regionaloffices: [],
  leadfeedback: [],
  scrapeRuns: [],
};

const adapter = new JSONFile(file);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= structuredClone(defaultData);
  for (const key of Object.keys(defaultData)) {
    db.data[key] ||= [];
  }
  await db.write();
}

// Generic collection helpers, mirroring the shape the old BaseCrudService
// exposed to the frontend (getAll / getById / create / update / delete)
// so the REST API underneath stays a near drop-in replacement for Wix Data.
export const Collection = {
  async getAll(name, { limit = 50, skip = 0, filter, sort } = {}) {
    await db.read();
    let items = [...(db.data[name] || [])];
    if (filter) items = items.filter(filter);
    if (sort) items = items.sort(sort);
    const totalCount = items.length;
    const page = items.slice(skip, skip + limit);
    const hasNext = skip + limit < totalCount;
    return {
      items: page,
      totalCount,
      hasNext,
      currentPage: Math.floor(skip / limit),
      pageSize: limit,
      nextSkip: hasNext ? skip + limit : null,
    };
  },

  async getById(name, id) {
    await db.read();
    return (db.data[name] || []).find((item) => item._id === id) || null;
  },

  async create(name, data) {
    await db.read();
    const item = {
      _id: uuid(),
      _createdDate: new Date().toISOString(),
      _updatedDate: new Date().toISOString(),
      ...data,
    };
    db.data[name].push(item);
    await db.write();
    return item;
  },

  async update(name, id, patch) {
    await db.read();
    const idx = db.data[name].findIndex((item) => item._id === id);
    if (idx === -1) throw new Error(`${name} item ${id} not found`);
    db.data[name][idx] = {
      ...db.data[name][idx],
      ...patch,
      _id: id,
      _updatedDate: new Date().toISOString(),
    };
    await db.write();
    return db.data[name][idx];
  },

  async upsertByKey(name, keyField, keyValue, patch) {
    await db.read();
    const idx = db.data[name].findIndex((item) => item[keyField] === keyValue);
    if (idx === -1) {
      return Collection.create(name, { [keyField]: keyValue, ...patch });
    }
    return Collection.update(name, db.data[name][idx]._id, patch);
  },

  async remove(name, id) {
    await db.read();
    const before = db.data[name].length;
    db.data[name] = db.data[name].filter((item) => item._id !== id);
    await db.write();
    return before !== db.data[name].length;
  },
};

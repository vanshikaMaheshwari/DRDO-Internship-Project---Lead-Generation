const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Same call shape as the original Wix-backed BaseCrudService
 * (getAll / getById / create / update / delete), now talking to the local
 * Express + live-scraper backend. This is intentionally the *only* file
 * pages needed to change in order to leave Wix behind.
 */
export class BaseCrudService {
  static async getAll<T>(
    collectionId: string,
    _includeRefs?: unknown,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const limit = pagination?.limit ?? 50;
    const skip = pagination?.skip ?? 0;
    return request<PaginatedResult<T>>(`/${collectionId}?limit=${limit}&skip=${skip}`);
  }

  static async getById<T>(collectionId: string, itemId: string): Promise<T | null> {
    try {
      return await request<T>(`/${collectionId}/${itemId}`);
    } catch {
      return null;
    }
  }

  static async create<T>(collectionId: string, itemData: Partial<T>): Promise<T> {
    return request<T>(`/${collectionId}`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  static async update<T extends { _id: string }>(collectionId: string, itemData: T): Promise<T> {
    return request<T>(`/${collectionId}/${itemData._id}`, {
      method: 'PATCH',
      body: JSON.stringify(itemData),
    });
  }

  static async delete<T>(collectionId: string, itemId: string): Promise<T> {
    return request<T>(`/${collectionId}/${itemId}`, { method: 'DELETE' });
  }
}

/** Triggers a live scrape run on the backend right now. */
export async function triggerLiveScrape() {
  return request<{ ok: boolean; results: unknown[] }>(`/scrape/run`, { method: 'POST' });
}

/** Fetches recent scrape run history for a status/monitoring view. */
export async function getScrapeRuns(limit = 20) {
  return request<PaginatedResult<any>>(`/scrape/runs?limit=${limit}`);
}

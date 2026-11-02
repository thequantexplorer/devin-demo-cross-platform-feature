import { isOnline } from './network';

// In-memory stand-in for the Parks API. Every call takes `latencyMs` and fails
// with a NetworkError while the simulated network is offline.

export class NetworkError extends Error {
  constructor() {
    super('Network request failed: device is offline');
    this.name = 'NetworkError';
  }
}

let latencyMs = 600;
let favoriteIds = new Set<string>();
let visitedIds = new Set<string>();

function request<T>(work: () => T): Promise<T> {
  const respond = () => {
    if (!isOnline()) throw new NetworkError();
    return work();
  };
  if (latencyMs === 0) return Promise.resolve().then(respond);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(respond());
      } catch (error) {
        reject(error);
      }
    }, latencyMs);
  });
}

export const server = {
  getVisited(): Promise<string[]> {
    return request(() => [...visitedIds].sort());
  },
  setVisited(parkId: string, visited: boolean): Promise<void> {
    return request(() => {
      if (visited) visitedIds.add(parkId);
      else visitedIds.delete(parkId);
    });
  },
  getFavorites(): Promise<string[]> {
    return request(() => [...favoriteIds].sort());
  },
  setFavorite(parkId: string, favorite: boolean): Promise<void> {
    return request(() => {
      if (favorite) favoriteIds.add(parkId);
      else favoriteIds.delete(parkId);
    });
  },
};

// Test helpers.
export function setLatency(ms: number): void {
  latencyMs = ms;
}

export function resetServer(): void {
  favoriteIds = new Set();
  visitedIds = new Set();
  latencyMs = 600;
}

export function serverFavorites(): string[] {
  return [...favoriteIds].sort();
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isOnline, subscribe } from '../api/network';
import { server } from '../api/server';

// Favorites work offline. `favorites` is what the user sees; `synced` is what
// the server is known to have. Any park where they differ is a pending change.
// Both are saved on the device so pending changes survive a restart.
const STORAGE_KEY = 'parks.favorites.v1';

type Stored = { favorites: string[]; synced: string[] };

type Change = { parkId: string; favorite: boolean };

function pendingChanges(favorites: Set<string>, synced: Set<string>): Change[] {
  const changes: Change[] = [];
  for (const parkId of new Set([...favorites, ...synced])) {
    const favorite = favorites.has(parkId);
    if (favorite !== synced.has(parkId)) changes.push({ parkId, favorite });
  }
  return changes;
}

async function load(): Promise<Stored | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const store = useRef({ favorites: new Set<string>(), synced: new Set<string>() });
  const loaded = useRef(false);
  const whenLoaded = useRef<Promise<void>>(Promise.resolve());
  const flushing = useRef(false);
  const flushAgain = useRef(false);

  const publish = useCallback(() => {
    const { favorites: current, synced } = store.current;
    setFavorites(new Set(current));
    setPendingCount(pendingChanges(current, synced).length);
  }, []);

  const persist = useCallback(() => {
    const { favorites: current, synced } = store.current;
    const value: Stored = { favorites: [...current], synced: [...synced] };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value)).catch(() => {});
  }, []);

  const flush = useCallback(async () => {
    if (flushing.current) {
      flushAgain.current = true;
      return;
    }
    flushing.current = true;
    try {
      do {
        flushAgain.current = false;
        while (isOnline()) {
          const changes = pendingChanges(store.current.favorites, store.current.synced);
          if (changes.length === 0) break;
          setSyncing(true);
          const results = await Promise.allSettled(
            changes.map(({ parkId, favorite }) => server.setFavorite(parkId, favorite)),
          );
          let failed = false;
          results.forEach((result, index) => {
            const { parkId, favorite } = changes[index];
            if (result.status === 'rejected') {
              failed = true;
            } else if (favorite) {
              store.current.synced.add(parkId);
            } else {
              store.current.synced.delete(parkId);
            }
          });
          persist();
          publish();
          if (failed) break;
        }
      } while (flushAgain.current && isOnline());
    } finally {
      flushing.current = false;
      setSyncing(false);
    }
  }, [persist, publish]);

  useEffect(() => {
    let active = true;
    whenLoaded.current = load().then((stored) => {
      if (!active) return;
      if (stored) {
        store.current = {
          favorites: new Set(stored.favorites),
          synced: new Set(stored.synced),
        };
      }
      loaded.current = true;
      publish();
      void flush();
    });
    const unsubscribe = subscribe((online) => {
      if (online && loaded.current) void flush();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [flush, publish]);

  const toggleFavorite = useCallback(
    (parkId: string) => {
      const apply = () => {
        const current = store.current.favorites;
        if (current.has(parkId)) current.delete(parkId);
        else current.add(parkId);
        persist();
        publish();
        void flush();
      };
      if (loaded.current) apply();
      else void whenLoaded.current.then(apply);
    },
    [flush, persist, publish],
  );

  return { favorites, toggleFavorite, pendingCount, syncing };
}

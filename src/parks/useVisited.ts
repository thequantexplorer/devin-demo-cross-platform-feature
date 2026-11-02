import { useCallback, useEffect, useState } from 'react';

import { server } from '../api/server';

// Visited marks are online-only: each tap is sent straight to the server and
// shows an error if the request fails.
export function useVisited() {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    server
      .getVisited()
      .then((ids) => {
        if (active) setVisited(new Set(ids));
      })
      .catch(() => {
        if (active) setError("Couldn't load visited parks.");
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleVisited = useCallback(
    async (parkId: string) => {
      const next = !visited.has(parkId);
      try {
        await server.setVisited(parkId, next);
        setError(null);
        setVisited((current) => {
          const updated = new Set(current);
          if (next) updated.add(parkId);
          else updated.delete(parkId);
          return updated;
        });
      } catch {
        setError("Can't reach the server. Try again when you're online.");
      }
    },
    [visited],
  );

  return { visited, toggleVisited, error };
}

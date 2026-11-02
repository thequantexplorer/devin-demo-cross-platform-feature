// Simulated network state. The app's "Offline mode" switch flips this so the
// offline paths can be tested on simulators and emulators, where airplane mode
// is awkward or unavailable.
type Listener = (online: boolean) => void;

let online = true;
const listeners = new Set<Listener>();

export function isOnline(): boolean {
  return online;
}

export function setOnline(next: boolean): void {
  if (next === online) return;
  online = next;
  listeners.forEach((listener) => listener(online));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

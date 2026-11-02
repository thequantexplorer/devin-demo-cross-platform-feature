# Parks

A small Expo app (React Native, TypeScript) that lists US national parks.
You can mark a park as visited. It runs on Android and iOS from one codebase.

This repo is the starter for a Devin workshop lab. See [DEVIN_DEMO.md](DEVIN_DEMO.md).

## The task

Add **offline favorites with a sync badge**. The full spec is in
[docs/specs/offline-favorites.md](docs/specs/offline-favorites.md).

The acceptance tests are already written and they fail today:

```text
$ npm test

FAIL src/__tests__/offlineFavorites.test.tsx
PASS src/__tests__/App.test.tsx

  ● the sync badge says Synced when there is nothing to send
    Unable to find an element with testID: sync-badge
  ● a park can be favorited while offline and shows as pending
  ● pending favorites sync when the app is back online
  ● a favorite made online is sent to the server right away
  ● favorites and pending changes survive an app restart
  ● undoing a change before it syncs leaves nothing pending

Test Suites: 1 failed, 1 passed, 2 total
Tests:       6 failed, 3 passed, 9 total
```

## Layout

| Path | What it is |
| - | - |
| `src/App.tsx` | The park list screen |
| `src/components/` | `ParkRow`, `OfflineSwitch` |
| `src/parks/useVisited.ts` | The existing "Visited" feature. It only works online. |
| `src/api/server.ts` | A fake server that keeps data in memory and fails when offline |
| `src/api/network.ts` | A fake network. The **Offline mode** switch in the app turns it off. |
| `src/__tests__/` | Jest tests |
| `docs/specs/offline-favorites.md` | The feature spec |
| `.agents/skills/test-on-phones/SKILL.md` | How Devin runs the app on the Android emulator and the iOS Simulator |
| `.github/workflows/ci.yml` | Runs the type check and tests on every pull request |

## Commands

These are for Devin. You do not need to run anything yourself.

- `npm ci` installs packages.
- `npm test` runs the tests.
- `npm run typecheck` checks types.
- `npx expo start --android` or `npx expo start --ios` opens the app in Expo Go.

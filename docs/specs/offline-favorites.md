# Spec: offline favorites with a sync badge

## Why

Park visitors often have no signal. Today the only thing you can save is a
"Visited" mark, and it fails when you are offline. People want to star parks
anywhere and trust that the stars reach their account later.

## What to build

1. **Star button on every park row.** Next to "Mark visited", add a star
   button. Its accessibility label is `Favorite <park name>` when off and
   `Unfavorite <park name>` when on (for example `Favorite Acadia`).
2. **Works offline.** Tapping the star changes it at once, online or offline.
   It never shows an error.
3. **Saved on the device.** Favorites and changes that have not synced yet are
   saved with `@react-native-async-storage/async-storage`, so they survive an
   app restart.
4. **Sync.** Changes are sent with `server.setFavorite(parkId, favorite)` from
   `src/api/server.ts`. When the app is online they are sent right away. When it
   is offline they wait, and they are sent as soon as the app is back online
   (listen with `subscribe` from `src/api/network.ts`). A failed request stays
   pending and is retried on the next change or when the network comes back.
   Pending changes saved on the device are also sent when the app starts
   online.
5. **Sync badge in the header** (`testID="sync-badge"`), next to the title:
   - `Synced` when nothing is waiting to be sent.
   - `N pending` (for example `2 pending`) when changes are waiting.
   - `Syncing…` while requests are in flight.
6. **Undo before sync.** If a park is starred and then unstarred before it
   syncs, nothing is pending for that park.

## Out of scope

- Loading favorites from the server on first launch.
- Changing how "Visited" works.

## Acceptance tests

`src/__tests__/offlineFavorites.test.tsx` covers points 1 to 6. It fails today.

## Check on both platforms

The same build must work on Android and on iOS. **Offline mode** is not saved:
it is always off when the app starts. On each platform, record:

1. Turn on **Offline mode**. Star **Acadia** and **Arches**. The badge shows
   `2 pending`.
2. Turn off **Offline mode**. The badge shows `Syncing…`, then `Synced`.
3. Turn on **Offline mode** again and star **Denali**. The badge shows
   `1 pending`. Close the app fully and open it again. All three stars are
   still there. Offline mode is off again, so the saved change is sent and
   the badge ends on `Synced`.

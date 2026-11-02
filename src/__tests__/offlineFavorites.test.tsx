// Acceptance tests for docs/specs/offline-favorites.md.
// They fail until the feature is built.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from '../App';
import { setOnline } from '../api/network';
import { resetServer, serverFavorites, setLatency } from '../api/server';

async function goOffline() {
  await fireEvent(await screen.findByLabelText('Offline mode'), 'valueChange', true);
}

async function goOnline() {
  await fireEvent(screen.getByLabelText('Offline mode'), 'valueChange', false);
}

beforeEach(async () => {
  resetServer();
  setLatency(0);
  setOnline(true);
  await AsyncStorage.clear();
});

test('the sync badge says Synced when there is nothing to send', async () => {
  await render(<App />);
  expect(await screen.findByTestId('sync-badge')).toHaveTextContent('Synced');
});

test('a park can be favorited while offline and shows as pending', async () => {
  await render(<App />);
  await goOffline();
  await fireEvent.press(await screen.findByLabelText('Favorite Acadia'));

  expect(await screen.findByLabelText('Unfavorite Acadia')).toBeOnTheScreen();
  expect(screen.getByTestId('sync-badge')).toHaveTextContent('1 pending');
  expect(serverFavorites()).toEqual([]);
});

test('pending favorites sync when the app is back online', async () => {
  await render(<App />);
  await goOffline();
  await fireEvent.press(await screen.findByLabelText('Favorite Acadia'));
  await fireEvent.press(screen.getByLabelText('Favorite Arches'));
  expect(screen.getByTestId('sync-badge')).toHaveTextContent('2 pending');

  await goOnline();

  await waitFor(() => expect(screen.getByTestId('sync-badge')).toHaveTextContent('Synced'));
  expect(serverFavorites()).toEqual(['acadia', 'arches']);
});

test('a favorite made online is sent to the server right away', async () => {
  await render(<App />);
  await fireEvent.press(await screen.findByLabelText('Favorite Denali'));

  await waitFor(() => expect(serverFavorites()).toEqual(['denali']));
  expect(screen.getByTestId('sync-badge')).toHaveTextContent('Synced');
});

test('favorites and pending changes survive an app restart', async () => {
  const first = await render(<App />);
  await goOffline();
  await fireEvent.press(await screen.findByLabelText('Favorite Glacier'));
  await first.unmount();

  await render(<App />);

  expect(await screen.findByLabelText('Unfavorite Glacier')).toBeOnTheScreen();
  expect(screen.getByTestId('sync-badge')).toHaveTextContent('1 pending');
});

test('undoing a change before it syncs leaves nothing pending', async () => {
  await render(<App />);
  await goOffline();
  await fireEvent.press(await screen.findByLabelText('Favorite Acadia'));
  await fireEvent.press(await screen.findByLabelText('Unfavorite Acadia'));

  expect(screen.getByTestId('sync-badge')).toHaveTextContent('Synced');
  await goOnline();
  await waitFor(() => expect(serverFavorites()).toEqual([]));
});

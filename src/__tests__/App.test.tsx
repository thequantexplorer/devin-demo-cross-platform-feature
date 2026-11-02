import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '../App';
import { setOnline } from '../api/network';
import { resetServer, setLatency } from '../api/server';

beforeEach(() => {
  resetServer();
  setLatency(0);
  setOnline(true);
});

test('lists every park', async () => {
  await render(<App />);
  expect(await screen.findByText('Acadia')).toBeOnTheScreen();
  expect(screen.getByText('Arches')).toBeOnTheScreen();
  expect(screen.getByText('Denali')).toBeOnTheScreen();
});

test('marks a park visited when online', async () => {
  await render(<App />);
  await fireEvent.press(await screen.findByLabelText('Mark Arches visited'));
  expect(await screen.findByLabelText('Arches visited')).toBeOnTheScreen();
});

test('shows an error when marking a park visited offline', async () => {
  await render(<App />);
  await fireEvent(await screen.findByLabelText('Offline mode'), 'valueChange', true);
  await fireEvent.press(screen.getByLabelText('Mark Arches visited'));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    "Can't reach the server. Try again when you're online.",
  );
  expect(screen.getByLabelText('Mark Arches visited')).toBeOnTheScreen();
});

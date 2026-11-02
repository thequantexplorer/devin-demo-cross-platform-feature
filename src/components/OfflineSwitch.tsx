import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text } from 'react-native';

import { isOnline, setOnline, subscribe } from '../api/network';

export function OfflineSwitch() {
  const [offline, setOffline] = useState(!isOnline());

  useEffect(() => subscribe((online) => setOffline(!online)), []);

  return (
    <Pressable style={styles.row} onPress={() => setOnline(offline)} hitSlop={8}>
      <Text style={styles.label}>Offline mode</Text>
      <Switch
        testID="offline-switch"
        accessibilityLabel="Offline mode"
        value={offline}
        onValueChange={(value) => setOnline(!value)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  label: { fontSize: 13, color: '#4b5563' },
});

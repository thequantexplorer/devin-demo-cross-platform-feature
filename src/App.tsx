import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { OfflineSwitch } from './components/OfflineSwitch';
import { ParkRow } from './components/ParkRow';
import { SyncBadge } from './components/SyncBadge';
import { parks } from './data/parks';
import { useFavorites } from './parks/useFavorites';
import { useVisited } from './parks/useVisited';

export default function App() {
  return (
    <SafeAreaProvider>
      <ParksScreen />
    </SafeAreaProvider>
  );
}

function ParksScreen() {
  const { visited, toggleVisited, error } = useVisited();
  const { favorites, toggleFavorite, pendingCount, syncing } = useFavorites();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} accessibilityRole="header">
            Parks
          </Text>
          <SyncBadge pendingCount={pendingCount} syncing={syncing} />
        </View>
        <OfflineSwitch />
      </View>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      <FlatList
        data={parks}
        keyExtractor={(park) => park.id}
        renderItem={({ item }) => (
          <ParkRow
            park={item}
            visited={visited.has(item.id)}
            favorite={favorites.has(item.id)}
            onToggleVisited={toggleVisited}
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  error: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
  },
});

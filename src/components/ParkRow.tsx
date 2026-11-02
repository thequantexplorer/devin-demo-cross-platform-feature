import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Park } from '../data/parks';

type Props = {
  park: Park;
  visited: boolean;
  onToggleVisited: (parkId: string) => void;
};

export function ParkRow({ park, visited, onToggleVisited }: Props) {
  return (
    <View style={styles.row} testID={`park-${park.id}`}>
      <View style={styles.text}>
        <Text style={styles.name}>{park.name}</Text>
        <Text style={styles.state}>{park.state}</Text>
        <Text style={styles.blurb}>{park.blurb}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visited ? `${park.name} visited` : `Mark ${park.name} visited`}
        onPress={() => onToggleVisited(park.id)}
        style={[styles.visited, visited && styles.visitedOn]}
      >
        <Text style={[styles.visitedText, visited && styles.visitedTextOn]}>
          {visited ? 'Visited' : 'Mark visited'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  text: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  state: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  blurb: { fontSize: 13, color: '#374151', marginTop: 4 },
  visited: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  visitedOn: { backgroundColor: '#065f46', borderColor: '#065f46' },
  visitedText: { fontSize: 12, color: '#374151' },
  visitedTextOn: { color: '#ffffff' },
});

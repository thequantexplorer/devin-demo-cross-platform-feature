import { StyleSheet, Text } from 'react-native';

type Props = {
  pendingCount: number;
  syncing: boolean;
};

export function SyncBadge({ pendingCount, syncing }: Props) {
  const label = syncing ? 'Syncing…' : pendingCount > 0 ? `${pendingCount} pending` : 'Synced';
  const tone = syncing ? styles.syncing : pendingCount > 0 ? styles.pending : styles.synced;

  return (
    <Text testID="sync-badge" accessibilityLiveRegion="polite" style={[styles.badge, tone]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  synced: { backgroundColor: '#ecfdf5', color: '#065f46' },
  pending: { backgroundColor: '#fffbeb', color: '#92400e' },
  syncing: { backgroundColor: '#eff6ff', color: '#1e40af' },
});

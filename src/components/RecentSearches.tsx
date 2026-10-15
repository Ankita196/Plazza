import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props {
  searches: string[];
  onSelect: (term: string) => void;
  onClear: () => void;
}

export const RecentSearches: React.FC<Props> = ({ searches, onSelect, onClear }) => {
  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RECENT SEARCHES</Text>
        <TouchableOpacity
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear recent searches"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searches.map((term, index) => (
          <TouchableOpacity
            key={`${term}-${index}`}
            style={styles.chip}
            onPress={() => onSelect(term)}
            accessibilityRole="button"
            accessibilityLabel={`Search for ${term}`}
          >
            <Text style={styles.clockIcon}>🕒</Text>
            <Text style={styles.chipText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 32,
  },
  clockIcon: {
    fontSize: 11,
    marginRight: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
});

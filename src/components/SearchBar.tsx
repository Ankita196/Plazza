import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  isLoading = false,
  placeholder = 'Search medicines or salts (e.g. Dolo, Paracetamol)...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityRole="search"
          accessibilityLabel="Search medicines by name or salt"
        />
        {isLoading && (
          <ActivityIndicator size="small" color="#0D9488" style={styles.iconRight} />
        )}
        {!isLoading && value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.iconRight}
            accessibilityRole="button"
            accessibilityLabel="Clear search input"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  iconRight: {
    padding: 6,
    marginLeft: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
});

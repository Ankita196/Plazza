import { useState, useEffect, useCallback, useMemo } from 'react';
import { Medicine } from '../types';
import { CATALOG } from '../data/catalog';
import { StorageService } from '../services/storageService';

export function useMedicineSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    StorageService.loadRecentSearches().then(setRecentSearches);
  }, []);

  const addRecentSearch = useCallback(async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      // Remove if already exists, then prepend
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      StorageService.saveRecentSearches(updated);
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    await StorageService.saveRecentSearches([]);
  }, []);

  // Filter catalog based on name or salt
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    return CATALOG.filter(med => {
      const matchName = med.name.toLowerCase().includes(trimmed);
      const matchSalt = med.salt.toLowerCase().includes(trimmed);
      return matchName || matchSalt;
    });
  }, [query]);

  const handleSearchSubmit = useCallback(() => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  }, [query, addRecentSearch]);

  const selectRecentSearch = useCallback((term: string) => {
    setQuery(term);
    addRecentSearch(term);
  }, [addRecentSearch]);

  return {
    query,
    setQuery,
    isLoading,
    setIsLoading,
    searchResults,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    handleSearchSubmit,
    selectRecentSearch,
    allMedicines: CATALOG,
  };
}

import { StorageService, CURRENT_STORAGE_VERSION, STORAGE_KEYS } from '../src/services/storageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Robust Persistence & Versioned Schema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves data wrapped in versioned envelope', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const testSearches = ['Dolo 650', 'Paracetamol'];
    await StorageService.saveRecentSearches(testSearches);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.RECENT_SEARCHES,
      expect.stringContaining(`"version":${CURRENT_STORAGE_VERSION}`),
    );
  });

  it('safely recovers fallback when storage item is null or missing', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await StorageService.getItem('test_key', ['default']);
    expect(result).toEqual(['default']);
  });

  it('safely recovers fallback when storage has corrupted non-JSON data without crashing', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{corrupted_json:::###');

    const result = await StorageService.getItem('test_key', ['safe_fallback']);
    expect(result).toEqual(['safe_fallback']);
  });

  it('strictly caps recent searches to a maximum of 5 items', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const longList = ['term1', 'term2', 'term3', 'term4', 'term5', 'term6', 'term7'];
    await StorageService.saveRecentSearches(longList);

    const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    const savedEnvelope = JSON.parse(setItemCall[1]);
    expect(savedEnvelope.data.length).toBe(5);
    expect(savedEnvelope.data).toEqual(['term1', 'term2', 'term3', 'term4', 'term5']);
  });
});

const mockStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async (key, value) => {
    mockStorage.set(key, value);
    return null;
  }),
  getItem: jest.fn(async key => {
    return mockStorage.get(key) || null;
  }),
  removeItem: jest.fn(async key => {
    mockStorage.delete(key);
    return null;
  }),
  clear: jest.fn(async () => {
    mockStorage.clear();
    return null;
  }),
  getAllKeys: jest.fn(async () => {
    return Array.from(mockStorage.keys());
  }),
}));

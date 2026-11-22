import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = '@yatzari:access';
const REFRESH_KEY = '@yatzari:refresh';

export const storage = {
  saveTokens: async (access: string, refresh: string) => {
    await AsyncStorage.multiSet([
      [ACCESS_KEY, access],
      [REFRESH_KEY, refresh],
    ]);
  },

  getAccess: (): Promise<string | null> => {
    return AsyncStorage.getItem(ACCESS_KEY);
  },

  getRefresh: (): Promise<string | null> => {
    return AsyncStorage.getItem(REFRESH_KEY);
  },

  clearTokens: async () => {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
  },
};
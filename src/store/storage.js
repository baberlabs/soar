import { get, set, del } from "idb-keyval";
import { createJSONStorage } from "zustand/middleware";

export const STORAGE_KEY = "soar_state";

const indexedDBStateStorage = {
  async getItem(name) {
    const value = await get(name);
    return value ?? null;
  },

  async setItem(name, value) {
    await set(name, value);
  },

  async removeItem(name) {
    await del(name);
  },
};

export const indexedDBStorage = createJSONStorage(() => indexedDBStateStorage);

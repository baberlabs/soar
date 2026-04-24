import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORE_VERSION, createDefaultStore } from "./defaultState";
import { normalizeStore } from "./normalizers";
import { soarReducer } from "./reducer";
import { indexedDBStorage, STORAGE_KEY } from "./storage";

export const useSOARStore = create(
  persist(
    (set, get) => ({
      hasHydrated: false,
      store: createDefaultStore(),

      helpers: {
        authenticatePeer(email, password) {
          const normalizedEmail = email.trim().toLowerCase();

          return (
            get().store.peers.find(
              (peer) =>
                peer.email.toLowerCase() === normalizedEmail &&
                peer.password === password,
            ) ?? null
          );
        },
      },

      setHasHydrated(value) {
        set({ hasHydrated: value });
      },

      dispatch(action) {
        set((current) => ({
          store: soarReducer(current.store, action),
        }));
      },

      replaceStore(nextStore) {
        set({ store: normalizeStore(nextStore) });
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: indexedDBStorage,
      partialize: (state) => ({
        store: {
          version: state.store.version,
          session: state.store.session,
          peers: state.store.peers,
          forum: state.store.forum,
          connections: state.store.connections,
          newsletterSubscribers: state.store.newsletterSubscribers,
        },
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        store: normalizeStore(persistedState?.store),
      }),
      migrate: (persistedState) => ({
        store: normalizeStore(persistedState?.store),
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to hydrate SOAR store:", error);
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);

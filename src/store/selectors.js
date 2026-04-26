import { useMemo } from "react";
import { sanitizePeer, normalizeReflections } from "./normalizers";
import { useSOARStore } from "./useSOARStore";

const getCurrentPeer = (store) =>
  store.peers.find((peer) => peer.id === store.session.currentUserId) ?? null;

const deriveState = (store) => {
  const user = getCurrentPeer(store);
  const userId = user?.id ?? null;

  return {
    ...store,
    peers: store.peers.map(sanitizePeer),
    user: user ? sanitizePeer(user) : null,
    curriculum: user?.curriculum ?? [],
    creations: user?.creations ?? [],
    reflections: normalizeReflections(user?.reflections),
    connections: userId
      ? store.connections.filter((connection) =>
          connection.peers.includes(userId),
        )
      : [],
  };
};

export const useSOARHydrated = () => useSOARStore((state) => state.hasHydrated);

export const useSOARState = () => {
  const store = useSOARStore((state) => state.store);
  return useMemo(() => deriveState(store), [store]);
};

export const useSOARDispatch = () => useSOARStore((state) => state.dispatch);

export const useSOARHelpers = () => useSOARStore((state) => state.helpers);

export const useSOARRawStore = () => useSOARStore((state) => state.store);

export const useSOARReplaceStore = () =>
  useSOARStore((state) => state.replaceStore);

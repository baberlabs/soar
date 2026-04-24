import { normalizePeer } from "../normalizers";

export const getCurrentPeer = (state) =>
  state.peers.find((peer) => peer.id === state.session.currentUserId) ?? null;

export const updateCurrentPeer = (state, updater) => {
  const currentUserId = state.session.currentUserId;
  if (!currentUserId) return state;

  let wasUpdated = false;

  const peers = state.peers.map((peer) => {
    if (peer.id !== currentUserId) return peer;

    const nextPeer = normalizePeer(updater(peer));
    wasUpdated = true;
    return nextPeer;
  });

  return wasUpdated ? { ...state, peers } : state;
};

import { PEER_DIRECTORY } from "../../../data/peers";

export const buildForumAuthorMap = (peers = []) => {
  const map = {};

  PEER_DIRECTORY.forEach((peer) => {
    map[peer.id] = {
      ...peer,
      fullName: peer.name,
    };
  });

  peers.forEach((peer) => {
    if (peer?.id) {
      map[peer.id] = peer;
    }
  });

  return map;
};

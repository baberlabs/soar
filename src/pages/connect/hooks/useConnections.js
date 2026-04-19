import { useMemo } from "react";
import { PEER_DIRECTORY, getPeerById } from "../../../data/peers";

/**
 * Transform raw store connections into chat-ready records annotated with
 * the resolved peer object, messages array, and last message.
 *
 * Keeps the page components blind to the store shape.
 */
export const useConnections = (connections, currentUserId) =>
  useMemo(
    () =>
      (connections ?? []).map((connection) => {
        const peerId = (connection.members ?? []).find(
          (id) => id !== currentUserId,
        );
        const peer =
          getPeerById(peerId) ??
          connection.peer ??
          PEER_DIRECTORY.find((entry) => entry.id === peerId) ??
          null;
        const messages = connection.messages ?? [];
        const lastMessage = messages[messages.length - 1] ?? null;

        return {
          ...connection,
          peer,
          peerId,
          messages,
          lastMessage,
        };
      }),
    [connections, currentUserId],
  );

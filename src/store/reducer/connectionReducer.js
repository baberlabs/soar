import { createConnection, createMessage, nowIso } from "../factories";
import { normalizeConnection } from "../normalizers";

const hasSamePeers = (left = [], right = []) => {
  if (left.length !== right.length) return false;
  const set = new Set(left);
  return right.every((value) => set.has(value));
};

export const reduceConnectionActions = (state, action) => {
  switch (action.type) {
    case "ADD_CONNECTION": {
      const incomingPeers = Array.isArray(action.payload.peers)
        ? Array.from(new Set(action.payload.peers.filter(Boolean)))
        : [];

      const existingConnection = state.connections.find((connection) =>
        hasSamePeers(connection.peers, incomingPeers),
      );

      if (existingConnection) return state;

      return {
        ...state,
        connections: [
          ...state.connections,
          createConnection({
            ...action.payload,
            peers: incomingPeers,
            messages: [],
          }),
        ],
      };
    }

    case "ACCEPT_CONNECTION": {
      const { connectionId, mockMessage } = action.payload;
      const timestamp = nowIso();

      return {
        ...state,
        connections: state.connections.map((connection) => {
          if (connection.id !== connectionId) return connection;

          const nextMessages = mockMessage
            ? [
                ...(connection.messages ?? []),
                createMessage({
                  body: mockMessage.body,
                  fromUserId: mockMessage.fromUserId,
                  at: timestamp,
                }),
              ]
            : (connection.messages ?? []);

          return {
            ...connection,
            status: "accepted",
            acceptedAt: connection.acceptedAt ?? timestamp,
            messages: nextMessages,
          };
        }),
      };
    }

    case "ADD_CONNECTION_MESSAGE": {
      const timestamp = nowIso();

      return {
        ...state,
        connections: state.connections.map((connection) =>
          connection.id === action.payload.connectionId
            ? {
                ...connection,
                status:
                  connection.status === "pending"
                    ? "accepted"
                    : connection.status,
                acceptedAt:
                  connection.status === "pending"
                    ? (connection.acceptedAt ?? timestamp)
                    : connection.acceptedAt,
                messages: [
                  ...(connection.messages ?? []),
                  createMessage({
                    ...action.payload.message,
                    at: action.payload.message?.at ?? timestamp,
                  }),
                ],
              }
            : connection,
        ),
      };
    }

    case "UPDATE_CONNECTION":
      return {
        ...state,
        connections: state.connections.map((connection) =>
          connection.id === action.payload.id
            ? normalizeConnection({ ...connection, ...action.payload })
            : connection,
        ),
      };

    default:
      return state;
  }
};

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPeerById } from "../../../data/peers";
import { useSOARDispatch, useSOARState } from "../../../store";
import { SplitPane } from "../components/shared/SplitPane";
import { PeerFilters } from "../components/peers/PeerFilters";
import { PeerListItem } from "../components/peers/PeerListItem";
import { PeerDetail } from "../components/peers/PeerDetail";
import { usePanelParam } from "../hooks/usePanelParam";
import { buildPathwayOptions, buildRecommendedPeers } from "../utils/peers";
import { pickWelcomeMessage } from "../utils/welcomeMessages";

/**
 * Peers tab. URL-driven panel (?peerId=x) opens PeerDetail to the right
 * of the list on desktop, or replaces the list on mobile via SplitPane.
 *
 * Three store interactions:
 *   - Send request (ADD_CONNECTION with status: pending)
 *   - Accept as them (ACCEPT_CONNECTION — flips to accepted + seeds a
 *     mock welcome message from the peer)
 *   - Open chat (navigate to /connect/chats?chatId=x)
 */
export default function PeersTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const [peerId, setPeerId] = usePanelParam("peerId");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pathwayFilter, setPathwayFilter] = useState("all");

  const currentUserId = state.user.id;
  const interests = state.user.interests ?? [];
  const pathwayIds = state.curriculum.map((entry) => entry.subjectId);
  const connections = state.connections ?? [];

  const pathwayOptions = useMemo(
    () => buildPathwayOptions(pathwayIds, state.subjects),
    [pathwayIds, state.subjects],
  );

  const peers = useMemo(
    () =>
      buildRecommendedPeers({
        interests,
        pathwayIds,
        pathwayFilter,
        searchTerm,
        connections,
      }),
    [interests, pathwayIds, pathwayFilter, searchTerm, connections],
  );

  const openedPeer = useMemo(() => {
    if (!peerId) return null;
    return peers.find((peer) => peer.id === peerId) ?? getPeerById(peerId);
  }, [peerId, peers]);

  const openedConnection = useMemo(() => {
    if (!peerId) return null;
    return connections.find((connection) =>
      (connection.peers ?? []).includes(peerId),
    );
  }, [peerId, connections]);

  const sendConnectionRequest = () => {
    if (!openedPeer || openedConnection) return;
    dispatch({
      type: "ADD_CONNECTION",
      payload: {
        peers: [currentUserId, openedPeer.id],
        peer: openedPeer,
        status: "pending",
      },
    });
  };

  const acceptAsThem = () => {
    if (!openedConnection || openedConnection.status === "accepted") return;
    const welcomeBody = pickWelcomeMessage(openedPeer?.id);

    dispatch({
      type: "ACCEPT_CONNECTION",
      payload: {
        connectionId: openedConnection.id,
        mockMessage: welcomeBody
          ? { body: welcomeBody, fromUserId: openedPeer.id }
          : null,
      },
    });
  };

  const openChatWithPeer = () => {
    if (openedConnection?.status === "accepted") {
      navigate(`/connect/chats?chatId=${openedConnection.id}`);
    } else {
      navigate("/connect/chats");
    }
  };

  const connectionStatus = openedConnection?.status ?? null;
  const isConnected = connectionStatus === "accepted";

  return (
    <SplitPane
      isDetailOpen={Boolean(openedPeer)}
      listLabel="Peer recommendations"
      detailLabel="Peer profile"
      emptyDetail={
        <p className="max-w-xs text-center font-body text-sm text-brand/55">
          Select a peer to open their profile.
        </p>
      }
      list={
        <div className="space-y-4">
          <div className="rounded-3xl border border-brand/15 bg-cream p-4">
            <PeerFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              pathwayFilter={pathwayFilter}
              onPathwayChange={setPathwayFilter}
              pathwayOptions={pathwayOptions}
              resultCount={peers.length}
            />
          </div>

          <ul className="space-y-2 h-130 overflow-y-scroll vision-library-scrollbar">
            {peers.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-brand/25 bg-cream/60 p-5 text-center font-body text-sm text-brand/65">
                No peers match. Try widening your filters.
              </li>
            ) : (
              peers.map((peer) => (
                <li key={peer.id}>
                  <PeerListItem
                    peer={peer}
                    isActive={peer.id === peerId}
                    onSelect={setPeerId}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      }
      detail={
        openedPeer ? (
          <PeerDetail
            peer={openedPeer}
            subjects={state.subjects}
            isConnected={isConnected}
            connectionStatus={connectionStatus}
            onClose={() => setPeerId(null)}
            onSendRequest={sendConnectionRequest}
            onAcceptAsThem={acceptAsThem}
            onOpenChat={openChatWithPeer}
          />
        ) : null
      }
    />
  );
}

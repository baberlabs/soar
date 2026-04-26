import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Compass } from "lucide-react";
import { useSOARDispatch, useSOARState } from "../../../store";
import { Modal } from "../../../components/Modal";
import { PeerListItem } from "../components/peers/PeerListItem";
import { PeerDetail } from "../components/peers/PeerDetail";
import { usePanelParam } from "../hooks/usePanelParam";
import { PEER_DIRECTORY, getPeerById } from "../../../data/peers";
import { SUBJECTS } from "../../../data/subjects";
import { pickWelcomeMessage } from "../utils/welcomeMessages";

const INTERESTS = [
  "Design",
  "JavaScript",
  "Writing",
  "Philosophy",
  "Photography",
  "Meditation",
  "AI & Data",
  "Cooking",
  "Ecology",
];

export default function FindPeersTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const navigate = useNavigate();
  const [peerId, setPeerId] = usePanelParam("peerId");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeInterest, setActiveInterest] = useState("All");

  const currentUserId = state.user.id;
  const connections = state.connections ?? [];

  const filteredPeers = useMemo(() => {
    return PEER_DIRECTORY.filter((peer) => {
      if (peer.id === currentUserId) return false;
      const conn = connections.find((c) => (c.peers ?? []).includes(peer.id));
      if (conn?.status === "accepted") return false;

      const matchesSearch = peer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesInterest =
        activeInterest === "All" || peer.interests?.includes(activeInterest);
      return matchesSearch && matchesInterest;
    });
  }, [searchQuery, activeInterest, currentUserId, connections]);

  const openedPeer = useMemo(() => {
    if (!peerId) return null;
    return filteredPeers.find((p) => p.id === peerId) ?? getPeerById(peerId);
  }, [peerId, filteredPeers]);

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

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-brand/10 p-2 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Discover by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-transparent py-3 pl-12 pr-5 font-body text-sm text-brand placeholder:text-brand/40 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto border-t border-brand/5 px-3 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0 vision-library-scrollbar">
          <div className="flex shrink-0 items-center gap-2 pr-2">
            <SlidersHorizontal size={16} className="text-brand/40" />
            <span className="font-ui text-xs uppercase tracking-widest text-brand/50">
              Filter
            </span>
          </div>
          <select
            value={activeInterest}
            onChange={(e) => setActiveInterest(e.target.value)}
            className="shrink-0 cursor-pointer appearance-none rounded-full border border-brand/15 bg-brand/5 px-5 py-2 font-body text-sm text-brand transition-colors hover:bg-brand/10 focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="All">All Interests</option>
            {INTERESTS.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredPeers.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeers.map((peer) => (
            <li key={peer.id}>
              <PeerListItem
                peer={peer}
                isActive={peer.id === peerId}
                onSelect={setPeerId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand/20 bg-brand/5">
          <Compass size={40} className="mb-4 text-brand/30" strokeWidth={1.5} />
          <p className="font-body text-sm text-brand/60">
            No peers found matching your criteria.
          </p>
        </div>
      )}

      <Modal
        isOpen={Boolean(openedPeer)}
        onClose={() => setPeerId(null)}
        size="lg"
        ariaLabel="Peer profile"
      >
        {openedPeer && (
          <PeerDetail
            peer={openedPeer}
            onClose={() => setPeerId(null)}
            connectionStatus={connectionStatus}
            isConnected={connectionStatus === "accepted"}
            subjects={SUBJECTS}
            onSendRequest={sendConnectionRequest}
            onAcceptAsThem={acceptAsThem}
            onOpenChat={openChatWithPeer}
          />
        )}
      </Modal>
    </div>
  );
}

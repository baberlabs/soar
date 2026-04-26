import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users } from "lucide-react";
import { useSOARState } from "../../../store";
import { Modal } from "../../../components/Modal";
import { PeerListItem } from "../components/peers/PeerListItem";
import { PeerDetail } from "../components/peers/PeerDetail";
import { usePanelParam } from "../hooks/usePanelParam";
import { PEER_DIRECTORY } from "../../../data/peers";
import { SUBJECTS } from "../../../data/subjects";

export default function MyPeersTab() {
  const state = useSOARState();
  const navigate = useNavigate();
  const [peerId, setPeerId] = usePanelParam("peerId");
  const [searchQuery, setSearchQuery] = useState("");

  const connections = state.connections ?? [];

  const myPeers = useMemo(() => {
    const acceptedIds = connections
      .filter((c) => c.status === "accepted")
      .flatMap((c) => c.peers)
      .filter((id) => id !== state.user.id);

    return PEER_DIRECTORY.filter((p) => acceptedIds.includes(p.id));
  }, [connections, state.user.id]);

  const filteredPeers = useMemo(() => {
    if (!searchQuery) return myPeers;
    return myPeers.filter((peer) =>
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [myPeers, searchQuery]);

  const activePeer = useMemo(
    () => myPeers.find((p) => p.id === peerId),
    [myPeers, peerId],
  );

  const openChatWithPeer = () => {
    const conn = connections.find((c) => (c.peers ?? []).includes(peerId));
    if (conn) navigate(`/connect/chats?chatId=${conn.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/40"
          size={18}
        />
        <input
          type="text"
          placeholder="Search your network..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-brand/15 py-3 pl-12 pr-5 font-body text-sm text-brand shadow-sm transition-all placeholder:text-brand/40 focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-brand/5"
        />
      </div>

      {filteredPeers.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeers.map((peer) => (
            <li key={peer.id}>
              <PeerListItem
                peer={{ ...peer, alreadyConnected: true }}
                isActive={peer.id === peerId}
                onSelect={setPeerId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand/20 bg-brand/5">
          <Users size={40} className="mb-4 text-brand/30" strokeWidth={1.5} />
          <p className="font-body text-sm text-brand/60">
            {searchQuery
              ? "No connections match your search."
              : "You haven't connected with anyone yet."}
          </p>
        </div>
      )}

      <Modal
        isOpen={Boolean(activePeer)}
        onClose={() => setPeerId(null)}
        size="lg"
        ariaLabel="Peer profile"
      >
        {activePeer && (
          <PeerDetail
            peer={activePeer}
            onClose={() => setPeerId(null)}
            connectionStatus="accepted"
            isConnected={true}
            subjects={SUBJECTS}
            onOpenChat={openChatWithPeer}
          />
        )}
      </Modal>
    </div>
  );
}

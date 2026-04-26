import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSOARDispatch, useSOARState } from "../../../store";
import { SplitPane } from "../components/shared/SplitPane";
import { ChatListItem } from "../components/chats/ChatListItem";
import { ChatThread } from "../components/chats/ChatThread";
import { useConnections } from "../hooks/useConnections";
import { usePanelParam } from "../hooks/usePanelParam";
import { filterChatsBySearch } from "../utils/chat";
import { pickWelcomeMessage } from "../utils/welcomeMessages";

/**
 * Chats tab. URL-driven thread (?chatId=x) replaces the list on mobile,
 * opens to the right on desktop.
 *
 * Pending connections: the peer is mock data with no way to accept for
 * real, so we offer a "Accept as them" action in the thread's pending
 * banner. On accept, a deterministic welcome message is seeded so the
 * thread isn't empty.
 */
export default function ChatsTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const [chatId, setChatId] = usePanelParam("chatId");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const currentUserId = state.user.id;
  const chats = useConnections(state.connections, currentUserId);
  const filteredChats = useMemo(
    () => filterChatsBySearch(chats, search),
    [chats, search],
  );
  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === chatId) ?? null,
    [chats, chatId],
  );

  const sendMessage = (body) => {
    if (!activeChat) return;
    dispatch({
      type: "ADD_CONNECTION_MESSAGE",
      payload: {
        connectionId: activeChat.id,
        message: { body, fromUserId: currentUserId },
      },
    });
  };

  const acceptConnection = (chat) => {
    if (!chat || chat.status === "accepted") return;

    // Build the mock welcome message as a payload field so the reducer
    // stays pure (no side effects like Math.random inside the reducer).
    // Deterministic per peer ID so reloads don't show different welcomes.
    const welcomeBody = pickWelcomeMessage(chat.peerId);

    dispatch({
      type: "ACCEPT_CONNECTION",
      payload: {
        connectionId: chat.id,
        mockMessage: welcomeBody
          ? { body: welcomeBody, fromUserId: chat.peerId }
          : null,
      },
    });
  };

  const openProfile = () => {
    if (!activeChat?.peerId) return;
    navigate(`/connect/my-peers?peerId=${activeChat.peerId}`);
  };

  if (chats.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-brand/25 bg-cream/60 p-10 text-center">
        <p className="font-ui text-xl text-brand">No chats yet</p>
        <p className="mt-2 font-body text-sm text-brand/65">
          Send a request from the Peers tab to start one.
        </p>
        <div className="mt-5 inline-flex">
          <Link
            to="/connect/find-peers"
            className="inline-flex items-center rounded-full border border-brand/20 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
          >
            Find peers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SplitPane
      isDetailOpen={Boolean(activeChat)}
      listLabel="Chats"
      detailLabel="Chat thread"
      emptyDetail={
        <p className="max-w-xs text-center font-body text-sm text-brand/55">
          Open a chat to start the conversation.
        </p>
      }
      list={
        <div className="space-y-3">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search chats"
              aria-label="Search chats"
              className="w-full rounded-2xl border border-brand/15 bg-cream px-4 py-2.5 pr-10 font-body text-sm text-brand outline-none transition placeholder:text-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-ui text-xs text-brand/45"
            >
              ⌕
            </span>
          </div>

          <ul className="space-y-1 h-130 overflow-y-scroll vision-library-scrollbar">
            {filteredChats.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-brand/25 bg-cream/60 p-5 text-center font-body text-sm text-brand/65">
                No chats match.
              </li>
            ) : (
              filteredChats.map((chat) => (
                <li key={chat.id}>
                  <ChatListItem
                    chat={chat}
                    isActive={chat.id === chatId}
                    onSelect={setChatId}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      }
      detail={
        activeChat ? (
          <ChatThread
            chat={activeChat}
            currentUserId={currentUserId}
            onSend={sendMessage}
            onAccept={acceptConnection}
            onClose={() => setChatId(null)}
            onOpenProfile={openProfile}
          />
        ) : null
      }
    />
  );
}

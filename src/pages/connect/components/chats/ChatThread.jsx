import { useEffect, useRef } from "react";
import { Avatar } from "../shared/Avatar";
import { StatusDot } from "../shared/StatusDot";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { PendingChatBanner } from "./PendingChatBanner";

/**
 * Active chat thread. Autoscrolls to the bottom on message count change.
 *
 * Message grouping: consecutive messages from the same sender within
 * 2 minutes are treated as one group; only the last shows a time stamp.
 * This is standard chat UX (iMessage, Slack) and reduces visual noise.
 *
 * Pending state: when the connection hasn't been accepted yet, a
 * PendingChatBanner appears above the (disabled) composer. Clicking the
 * accept button dispatches the simulated acceptance via onAccept.
 */
export const ChatThread = ({
  chat,
  currentUserId,
  onSend,
  onAccept,
  onClose,
  onOpenProfile,
}) => {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chat.id, chat.messages.length]);

  const groupedMessages = groupMessages(chat.messages);
  const isPending = chat.status !== "accepted";

  return (
    <article className="flex h-140 flex-col overflow-hidden rounded-3xl border border-brand/15 bg-page shadow-[0_24px_48px_rgba(75,81,149,0.08)]">
      <header className="flex items-center gap-3 border-b border-brand/10 bg-cream/80 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand/18 font-ui text-base text-brand transition hover:border-brand/35 lg:hidden"
          aria-label="Back to chats"
        >
          <span aria-hidden="true">←</span>
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left transition hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          aria-label={`Open ${chat.peer?.name ?? "peer"}'s profile`}
        >
          <Avatar avatar={chat.peer?.avatar} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-ui text-base leading-tight text-brand">
              {chat.peer?.name ?? "Peer"}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-[0.65rem] text-brand/55">
              <StatusDot
                online={chat.peer?.onlineNow}
                label={chat.peer?.onlineNow ? "Online" : chat.peer?.city}
              />
            </div>
          </div>
        </button>
      </header>

      <div
        ref={scrollerRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-linear-to-b from-page to-cream/40 px-4 py-4"
      >
        {groupedMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="max-w-xs text-center font-body text-sm text-brand/55">
              {isPending
                ? "No messages yet."
                : "No messages yet. Send the first one."}
            </p>
          </div>
        ) : (
          groupedMessages.map((group) =>
            group.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMine={message.fromUserId === currentUserId}
                showTime={index === group.length - 1}
              />
            )),
          )
        )}
      </div>

      {isPending ? (
        <PendingChatBanner
          peerName={chat.peer?.name}
          onAccept={() => onAccept(chat)}
        />
      ) : null}

      <footer className="border-t border-brand/10 bg-cream/80 px-4 py-3 backdrop-blur">
        <MessageComposer onSend={onSend} disabled={isPending} />
      </footer>
    </article>
  );
};

/**
 * Group consecutive messages by the same sender within 2 minutes.
 * Returns an array of arrays.
 */
const groupMessages = (messages) => {
  const groups = [];
  const windowMs = 2 * 60 * 1000;

  messages.forEach((message) => {
    const lastGroup = groups[groups.length - 1];
    const last = lastGroup?.[lastGroup.length - 1];
    const sameSender = last && last.fromUserId === message.fromUserId;
    const closeInTime =
      last &&
      new Date(message.at).getTime() - new Date(last.at).getTime() < windowMs;

    if (sameSender && closeInTime) {
      lastGroup.push(message);
    } else {
      groups.push([message]);
    }
  });

  return groups;
};

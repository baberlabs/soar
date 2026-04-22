import { Avatar } from "../shared/Avatar";
import { StatusDot } from "../shared/StatusDot";
import { formatChatRelative } from "../../utils/chat";

/**
 * Single row in the chat list. Shows avatar, name, last-message preview,
 * relative time, and — for pending connections — a subtle status hint.
 */
export const ChatListItem = ({ chat, isActive, onSelect }) => {
  const preview =
    chat.lastMessage?.body ??
    (chat.status === "pending" ? "Awaiting their response" : "Say hello");

  return (
    <button
      type="button"
      onClick={() => onSelect(chat.id)}
      aria-current={isActive ? "true" : undefined}
      className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        isActive
          ? "border-brand shadow-[0_12px_28px_rgba(75,81,149,0.14)]"
          : "border-transparent bg-transparent hover:border-brand/15 "
      }`}
    >
      <div className="relative">
        <Avatar avatar={chat.peer?.avatar} size="md" />
        {chat.peer?.onlineNow ? (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-cream bg-sage"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-ui text-base leading-tight text-brand">
            {chat.peer?.name ?? "Peer"}
          </p>
          <p className="shrink-0 font-body text-[0.65rem] tabular-nums text-brand/50">
            {formatChatRelative(chat.lastMessage?.at)}
          </p>
        </div>
        <p className="mt-0.5 truncate font-body text-xs text-brand/65">
          {preview}
        </p>
        {chat.status === "pending" ? (
          <StatusDot online={false} label="Pending" className="mt-1.5" />
        ) : null}
      </div>
    </button>
  );
};

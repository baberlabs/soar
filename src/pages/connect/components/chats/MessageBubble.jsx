import { formatChatTime } from "../../utils/chat";

/**
 * One message. Ownership (mine / theirs) drives alignment and colour.
 * Consecutive messages from the same author should drop the time stamp
 * except on the last — that's the parent ChatThread's responsibility.
 */
export const MessageBubble = ({ message, isMine, showTime = true }) => (
  <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] rounded-2xl px-3.5 py-2 shadow-[0_6px_16px_rgba(75,81,149,0.05)] ${
        isMine
          ? "rounded-br-md bg-brand text-cream"
          : "rounded-bl-md bg-brand/10 text-brand"
      }`}
    >
      <p className="font-body text-sm leading-relaxed whitespace-pre-line">
        {message.body}
      </p>
      {showTime ? (
        <p
          className={`mt-1 text-right font-body text-[0.62rem] tabular-nums ${
            isMine ? "text-cream/65" : "text-brand/50"
          }`}
        >
          {formatChatTime(message.at)}
        </p>
      ) : null}
    </div>
  </div>
);

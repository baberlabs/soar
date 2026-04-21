import { useState } from "react";

import SendIcon from "../../../../assets/icons/send.svg";

/**
 * Draft is held local so the parent tab component doesn't need to re-render
 * on every keystroke across all chats. Parent only learns about it on send.
 *
 * Enter submits, Shift+Enter inserts a newline — standard modern chat behaviour.
 */
export const MessageComposer = ({ onSend, disabled }) => {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onSend(value);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Request not yet accepted" : "Write a message"}
        rows={1}
        disabled={disabled}
        aria-label="Message"
        className="min-h-10 max-h-32 flex-1 resize-none rounded-2xl border border-brand/15 px-4 py-2.5 font-body text-sm leading-relaxed text-brand outline-none transition placeholder:text-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !draft.trim()}
        aria-label="Send message"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand shadow-[0_10px_22px_rgba(75,81,149,0.2)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <img src={SendIcon} className="size-5 ml-1" aria-hidden="true" />
      </button>
    </div>
  );
};

import { useState } from "react";
import { Button } from "../../../../components/Button";

/**
 * Textarea + submit for new comments. Ctrl/Cmd+Enter submits so peers
 * who write longer comments aren't forced off the keyboard. Empty
 * comments are silently ignored.
 */
export const CommentComposer = ({ onSubmit, placeholder, disabled }) => {
  const [body, setBody] = useState("");

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setBody("");
  };

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="comment-body" className="sr-only">
        Write a comment
      </label>
      <textarea
        id="comment-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          placeholder ?? "Share your thinking, question, or objection"
        }
        rows="3"
        disabled={disabled}
        className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="font-body text-xs text-brand/50">
          Cmd/Ctrl + Enter to post
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Post comment"
          onClick={submit}
          disabled={disabled || !body.trim()}
        />
      </div>
    </div>
  );
};

/**
 * Flat comment list. No nested replies. At this scale a linear feed is
 * simpler to skim and avoids the threading rabbit-hole. Each comment shows
 * the author, a relative timestamp, and the body.
 *
 * Author lookup is delegated to `resolveAuthor` from the parent since
 * peer names live in state — keeps this component a pure presenter.
 */

const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};

export const CommentList = ({ comments = [], resolveAuthor }) => {
  if (comments.length === 0) {
    return (
      <p className="font-body text-sm text-brand/55">
        No comments yet. Be the first to share your thinking.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => {
        const author = resolveAuthor?.(comment.authorId);
        return (
          <li
            key={comment.id}
            className="rounded-2xl border border-brand/12 bg-page/60 p-4"
          >
            <header className="flex items-baseline justify-between gap-3">
              <p className="font-ui text-sm tracking-[0.03em] text-brand">
                {author?.fullName ?? "Unknown peer"}
              </p>
              <p className="font-body text-[0.65rem] tabular-nums text-brand/50">
                {formatRelative(comment.at)}
              </p>
            </header>
            <p className="mt-1.5 font-body text-sm leading-relaxed whitespace-pre-line text-brand/80">
              {comment.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
};

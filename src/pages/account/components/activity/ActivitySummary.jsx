import { Link } from "react-router-dom";

/**
 * Activity tab is a summary view, not a destination for deep interaction.
 * Each card shows one headline stat, a one-line caption, and a link to the
 * page where the real work happens (Learn, Create, Reflect).
 *
 * This mirrors what GitHub's profile overview page does — it surfaces
 * recent activity as links into the real UIs, not a mini copy of them.
 */

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const LearningSummary = ({ curriculum = [], subjects = [] }) => {
  const enrolled = curriculum.length;
  const completedLessons = curriculum.reduce(
    (sum, entry) => sum + (entry.completedLessonIds?.length ?? 0),
    0,
  );
  const latest = curriculum
    .filter((entry) => entry.lastActivityAt)
    .sort((a, b) => (a.lastActivityAt < b.lastActivityAt ? 1 : -1))[0];

  const subjectName = (id) =>
    subjects.find((subject) => subject.id === id)?.name ?? id;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)]">
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Learning
      </p>
      <p className="mt-2 font-display text-4xl leading-none text-brand">
        {enrolled}
      </p>
      <p className="mt-1 font-body text-sm text-brand/70">
        {enrolled === 1 ? "pathway" : "pathways"} enrolled · {completedLessons}{" "}
        lesson{completedLessons === 1 ? "" : "s"} complete
      </p>

      {latest ? (
        <p className="mt-4 font-body text-xs text-brand/60">
          Last activity:{" "}
          <span className="text-brand/80">{subjectName(latest.subjectId)}</span>{" "}
          · {formatDate(latest.lastActivityAt)}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          Go to Learn
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

export const CreationsSummary = ({ creations = [] }) => {
  const count = creations.length;
  const latest = creations
    .filter((c) => c.publishedAt || c.createdAt)
    .sort((a, b) => {
      const aDate = a.publishedAt ?? a.createdAt;
      const bDate = b.publishedAt ?? b.createdAt;
      return aDate < bDate ? 1 : -1;
    })[0];

  return (
    <article className="flex h-full flex-col rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)]">
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Creations
      </p>
      <p className="mt-2 font-display text-4xl leading-none text-brand">
        {count}
      </p>
      <p className="mt-1 font-body text-sm text-brand/70">
        {count === 1 ? "piece" : "pieces"} published
      </p>

      {latest ? (
        <p className="mt-4 font-body text-xs text-brand/60">
          Latest:{" "}
          <span className="text-brand/80">{latest.title || "Untitled"}</span>
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        <Link
          to="/create"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          Go to Create
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

export const ReflectionsSummary = ({ reflections = {} }) => {
  const boards = reflections.visionBoards?.length ?? 0;
  const letters = reflections.letters?.length ?? 0;
  const entries = reflections.lessonEntries?.length ?? 0;
  const total = boards + letters + entries;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)]">
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Reflections
      </p>
      <p className="mt-2 font-display text-4xl leading-none text-brand">
        {total}
      </p>
      <p className="mt-1 font-body text-sm text-brand/70">
        {boards} moodboard{boards === 1 ? "" : "s"} · {letters} letter
        {letters === 1 ? "" : "s"} · {entries} lesson entr
        {entries === 1 ? "y" : "ies"}
      </p>

      <div className="mt-auto pt-5">
        <Link
          to="/reflect"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          Go to Reflect
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

export const GovernanceSummary = ({ forum = [], userId }) => {
  const mine = forum.filter((proposal) => proposal.authorId === userId);
  const authored = mine.length;
  const drafts = mine.filter((proposal) => proposal.status === "draft").length;
  const active = mine.filter((proposal) =>
    ["discussion", "voting"].includes(proposal.status),
  ).length;
  const closed = mine.filter((proposal) =>
    ["closed", "implemented", "withdrawn"].includes(proposal.status),
  ).length;

  const votesCast = forum.filter((proposal) => proposal.votes?.[userId]).length;
  const commentsPosted = forum.reduce((sum, proposal) => {
    const mineOnProposal = (proposal.comments ?? []).filter(
      (comment) => comment.authorId === userId,
    ).length;
    return sum + mineOnProposal;
  }, 0);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)]">
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Governance
      </p>
      <p className="mt-2 font-display text-4xl leading-none text-brand">
        {authored}
      </p>
      <p className="mt-1 font-body text-sm text-brand/70">
        proposal{authored === 1 ? "" : "s"} authored
      </p>

      <p className="mt-4 font-body text-xs text-brand/60">
        Drafts {drafts} · Active {active} · Closed {closed}
      </p>
      <p className="mt-1 font-body text-xs text-brand/60">
        Votes cast {votesCast} · Comments {commentsPosted}
      </p>

      <div className="mt-auto pt-5">
        <Link
          to={drafts > 0 ? "/forum/drafts" : "/forum/all"}
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          Go to Forum
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

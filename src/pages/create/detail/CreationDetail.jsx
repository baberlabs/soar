import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../../../components/Button";
import { useSOARDispatch, useSOARState } from "../../../store";
import { MediaViewerModal } from "../components/MediaViewerModal";
import {
  formatRelative,
  getMediaLabel,
  hasRenderableMedia,
  isExpandableMedia,
  renderCreationMedia,
} from "../utils/media.jsx";

export default function CreationDetail() {
  const { creationId } = useParams();
  const navigate = useNavigate();
  const state = useSOARState();
  const dispatch = useSOARDispatch();

  const creation = useMemo(
    () => (state.creations ?? []).find((entry) => entry.id === creationId),
    [state.creations, creationId],
  );

  const subject = useMemo(
    () =>
      creation?.subjectId
        ? state.subjects.find((entry) => entry.id === creation.subjectId)
        : null,
    [state.subjects, creation],
  );

  const [viewer, setViewer] = useState(null);
  // TODO: replace with a comments slice when available.
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");

  if (!creation) {
    return <Navigate to="/create" replace />;
  }

  const handleAddComment = (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setComments((current) => [
      ...current,
      {
        id: `comment_${Date.now()}`,
        author: state.user?.firstName || state.user?.name || "You",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "Delete this creation? This cannot be undone — the file is removed from your node.",
      )
    ) {
      return;
    }
    dispatch({ type: "REMOVE_CREATION", payload: creation.id });
    navigate("/create", { replace: true });
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-8 md:pb-8 md:pt-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 font-ui text-sm tracking-[0.08em] text-brand/70 transition hover:text-brand"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to gallery
        </Link>

        <header className="space-y-4 rounded-[1.75rem] border border-brand/12 bg-cream p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-brand">
              {getMediaLabel(creation.mediaKind)}
            </span>
            {subject ? (
              <Link
                to={`/learn/${subject.id}`}
                className="rounded-full bg-sky/30 px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-brand transition hover:bg-sky/45"
              >
                {subject.name}
              </Link>
            ) : null}
            <span className="rounded-full bg-sage/15 px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-sage">
              On your node
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] text-brand">
              {creation.title}
            </h1>
            <p className="font-body text-sm text-brand/65">
              {creation.media}
              {creation.date ? ` · ${creation.date}` : ""}
            </p>
          </div>

          {hasRenderableMedia(creation) ? (
            <div className="overflow-hidden rounded-2xl border border-brand/12 bg-page">
              {renderCreationMedia(creation, {
                className: "max-h-[28rem] w-full",
              })}
            </div>
          ) : null}

          {creation.note ? (
            <div className="rounded-2xl border border-brand/10 bg-page p-5">
              <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
                Note
              </p>
              <p className="mt-2 whitespace-pre-wrap font-body text-base leading-relaxed text-brand/82">
                {creation.note}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 border-t border-brand/10 pt-4">
            {isExpandableMedia(creation) ? (
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                text="View full size"
                onClick={() => setViewer(creation)}
              />
            ) : null}
            {creation.previewData ? (
              <a
                href={creation.previewData}
                download={creation.media || "attachment"}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/40 hover:bg-brand/5"
              >
                Download
              </a>
            ) : null}
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-4 py-2 font-ui text-sm tracking-[0.06em] text-rose-700 transition hover:border-rose-400 hover:bg-rose-50"
            >
              <Trash2 size={14} strokeWidth={1.75} />
              Delete
            </button>
          </div>
        </header>

        <section className="space-y-4 rounded-[1.75rem] border border-brand/12 bg-cream p-6 md:p-8">
          <header className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
                Discussion
              </p>
              <h2 className="mt-1 font-ui text-2xl text-brand">
                Comments
                {comments.length > 0 ? (
                  <span className="ml-2 font-body text-base text-brand/55">
                    ({comments.length})
                  </span>
                ) : null}
              </h2>
            </div>
          </header>

          {comments.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-brand/20 bg-page p-6 text-center font-body text-sm text-brand/72">
              No comments yet. Connected peers will be able to discuss this
              creation here.
            </p>
          ) : (
            <ul className="space-y-3">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-2xl border border-brand/10 bg-page p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-ui text-sm text-brand">
                      {comment.author}
                    </p>
                    <p className="font-body text-xs text-brand/55">
                      {formatRelative(comment.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap font-body text-sm leading-relaxed text-brand/82">
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddComment} className="space-y-3">
            <label
              htmlFor="creation-comment"
              className="block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
            >
              Add a comment
            </label>
            <textarea
              id="creation-comment"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="A thought, a question, a nudge..."
              className="min-h-24 w-full rounded-2xl border border-brand/16 bg-page px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                fullWidth={false}
                text="Post comment"
                disabled={draft.trim().length === 0}
              />
            </div>
          </form>
        </section>
      </div>

      <MediaViewerModal creation={viewer} onClose={() => setViewer(null)} />
    </main>
  );
}

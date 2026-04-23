import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSOARState } from "../../../hooks/useSOARState";
import { Modal } from "../../../components/Modal";

import { PhaseBadge } from "../components/shared/PhaseBadge";
import { AuthorActions } from "../components/discussion/AuthorActions";
import { CommentList } from "../components/discussion/CommentList";
import { CommentComposer } from "../components/discussion/CommentComposer";
import { Ballot } from "../components/voting/Ballot";
import { VoteStatus } from "../components/voting/VoteStatus";
import { OutcomeBanner } from "../components/outcome/OutcomeBanner";
import { VoteBreakdown } from "../components/outcome/VoteBreakdown";
import { ImplementationCard } from "../components/outcome/ImplementationCard";

import { useProposalLifecycle } from "../hooks/useProposalLifecycle";
import { useVoteTally } from "../hooks/useVoteTally";
import { PHASES } from "../utils/phase";
import { formatDeadline } from "../utils/voting";

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${bytes} B`;
};

const getAttachmentKind = (attachment) => {
  const mime = (attachment?.type ?? "").toLowerCase();
  const name = (attachment?.name ?? "").toLowerCase();

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (/\.(png|jpe?g|gif|webp|bmp|svg|avif)$/.test(name)) return "image";
  if (/\.(mp4|mov|webm|m4v|avi)$/.test(name)) return "video";
  if (/\.(mp3|wav|ogg|m4a|flac|aac)$/.test(name)) return "audio";
  if (mime.includes("pdf") || /\.(pdf)$/.test(name)) return "pdf";
  if (
    mime.startsWith("text/") ||
    /\.(txt|md|rtf|json|csv|js|jsx|ts|tsx|css|html)$/.test(name)
  ) {
    return "text";
  }
  return "file";
};

const canPreviewAttachment = (attachment) =>
  ["image", "video", "audio", "pdf", "text"].includes(
    getAttachmentKind(attachment),
  );

const decodeDataUrlText = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith("data:")) return "";

  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return "";

  const metadata = dataUrl.slice(0, commaIndex);
  const payload = dataUrl.slice(commaIndex + 1);

  try {
    if (metadata.includes(";base64")) {
      const binary = globalThis.atob(payload);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }
    return decodeURIComponent(payload);
  } catch {
    return "";
  }
};

/**
 * The full proposal detail page. Reads the proposal by id param,
 * derives the effective phase, and switches sub-sections on phase.
 *
 * Structure:
 *   - Top: back link + phase badge + title + meta
 *   - Author action bar (if applicable)
 *   - Description
 *   - Phase section:
 *     discussion → CommentList + CommentComposer
 *     voting     → VoteStatus + Ballot + (read-only previous comments)
 *     closed/imp → OutcomeBanner + VoteBreakdown + ImplementationCard
 *                  + (read-only comments, can add new ones post-close)
 *     withdrawn  → OutcomeBanner only + read-only discussion
 */
export default function ProposalDetail() {
  const { proposalId } = useParams();
  const [state, dispatch] = useSOARState();
  const navigate = useNavigate();
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);

  const user = state.user;
  const proposal = useMemo(
    () => (state.forum ?? []).find((p) => p.id === proposalId),
    [state.forum, proposalId],
  );

  // Lookup table for comment + vote author names.
  const peersById = useMemo(() => {
    const map = { [user.id]: user };
    (state.peers ?? []).forEach((peer) => {
      map[peer.id] = peer;
    });
    return map;
  }, [state.peers, user]);

  const resolveAuthor = useCallback(
    (authorId) => peersById[authorId] ?? null,
    [peersById],
  );

  const lifecycle = useProposalLifecycle({
    proposal,
    currentUserId: user.id,
  });

  // Quorum uses onboarded peer count as the eligible population.
  const eligiblePeerCount = useMemo(() => {
    const peersOnboarded = (state.peers ?? []).filter(
      (p) => p.onboardingComplete,
    ).length;
    // +1 for the current user (who is always "eligible" from their POV).
    return Math.max(1, peersOnboarded + 1);
  }, [state.peers]);

  const tally = useVoteTally({
    votes: proposal?.votes,
    eligiblePeerCount,
    isWithdrawn: proposal?.status === PHASES.WITHDRAWN,
  });

  // Guards — must come after all hooks, before any code that reads
  // proposal properties. Dispatch helpers below safely assume proposal exists.
  if (!proposal) return <Navigate to="/forum/all" replace />;
  if (proposal.status === PHASES.DRAFT && proposal.authorId !== user.id) {
    return <Navigate to="/forum/all" replace />;
  }

  // Dispatch helpers — thin wrappers so the JSX stays readable.
  const publish = () =>
    dispatch({ type: "PUBLISH_PROPOSAL", payload: { id: proposal.id } });
  const openVoting = (deadline) =>
    dispatch({
      type: "OPEN_VOTING",
      payload: { id: proposal.id, votingDeadline: deadline },
    });
  const withdraw = () =>
    dispatch({ type: "WITHDRAW_PROPOSAL", payload: { id: proposal.id } });
  const deleteDraft = () => {
    dispatch({ type: "REMOVE_PROPOSAL", payload: { id: proposal.id } });
    navigate("/forum/drafts", { replace: true });
  };
  const markImplemented = (note) =>
    dispatch({
      type: "MARK_IMPLEMENTED",
      payload: { id: proposal.id, implementationNote: note },
    });
  const castVote = (value) =>
    dispatch({
      type: "CAST_VOTE",
      payload: {
        proposalId: proposal.id,
        userId: user.id,
        voteValue: value,
      },
    });
  const addComment = (body) =>
    dispatch({
      type: "ADD_PROPOSAL_COMMENT",
      payload: { proposalId: proposal.id, body, authorId: user.id },
    });

  const author = resolveAuthor(proposal.authorId);
  const phase = lifecycle.phase;

  const openAttachmentPreview = useCallback((attachment) => {
    setImageZoom(1);
    setPreviewAttachment(attachment);
  }, []);

  const closeAttachmentPreview = useCallback(() => {
    setImageZoom(1);
    setPreviewAttachment(null);
  }, []);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <nav aria-label="Back to list">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand/65 transition hover:text-brand"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>
      </nav>

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <PhaseBadge phase={phase} />
          {phase === PHASES.VOTING && proposal.votingDeadline ? (
            <span className="font-body text-xs text-brand/60">
              Closes {formatDeadline(proposal.votingDeadline)}
            </span>
          ) : null}
        </div>
        <h1 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-none text-brand">
          {proposal.title || "Untitled proposal"}
        </h1>
        <p className="font-body text-sm text-brand/65">
          Proposed by {author?.fullName ?? "Unknown peer"}
          {proposal.publishedAt ? (
            <>
              {" · "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(proposal.publishedAt))}
            </>
          ) : null}
        </p>
      </header>

      {lifecycle.isAuthor &&
      (lifecycle.authorCanEdit ||
        lifecycle.authorCanPublish ||
        lifecycle.authorCanOpenVoting ||
        lifecycle.authorCanWithdraw ||
        lifecycle.authorCanDelete) ? (
        <AuthorActions
          proposalId={proposal.id}
          phase={phase}
          canEdit={lifecycle.authorCanEdit}
          canPublish={lifecycle.authorCanPublish}
          canOpenVoting={lifecycle.authorCanOpenVoting}
          canWithdraw={lifecycle.authorCanWithdraw}
          canDelete={lifecycle.authorCanDelete}
          onPublish={publish}
          onOpenVoting={openVoting}
          onWithdraw={withdraw}
          onDelete={deleteDraft}
        />
      ) : null}

      <section
        aria-label="Proposal description"
        className="rounded-3xl border border-brand/15 bg-cream p-5 md:p-6"
      >
        <p className="whitespace-pre-line font-body text-base leading-relaxed text-brand/85">
          {proposal.description}
        </p>

        {proposal.attachments?.length ? (
          <div className="mt-5 border-t border-brand/10 pt-4">
            <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
              Attachments
            </p>
            <ul className="mt-2 space-y-2">
              {proposal.attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/12 bg-page/60 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {getAttachmentKind(attachment) === "image" ? (
                      <img
                        src={attachment.dataUrl}
                        alt={attachment.name}
                        className="h-12 w-12 shrink-0 rounded-lg border border-brand/12 object-cover"
                      />
                    ) : null}

                    <div className="min-w-0">
                      <p className="truncate font-body text-sm text-brand/80">
                        {attachment.name}
                      </p>
                      <p className="font-body text-xs text-brand/55">
                        {formatBytes(attachment.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {canPreviewAttachment(attachment) ? (
                      <button
                        type="button"
                        onClick={() => openAttachmentPreview(attachment)}
                        className="rounded-full border border-brand/20 px-3 py-1.5 font-ui text-[0.62rem] tracking-[0.06em] text-brand/70 transition hover:border-brand/35 hover:text-brand"
                      >
                        Preview
                      </button>
                    ) : null}

                    <a
                      href={attachment.dataUrl}
                      download={attachment.name}
                      className="rounded-full border border-brand/20 px-3 py-1.5 font-ui text-[0.62rem] tracking-[0.06em] text-brand/70 transition hover:border-brand/35 hover:text-brand"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <AttachmentPreviewModal
        attachment={previewAttachment}
        imageZoom={imageZoom}
        onImageZoomChange={setImageZoom}
        onClose={closeAttachmentPreview}
      />

      {/* Phase-specific sections below */}

      {phase === PHASES.DISCUSSION ? (
        <DiscussionPhase
          proposal={proposal}
          resolveAuthor={resolveAuthor}
          onAddComment={addComment}
        />
      ) : null}

      {phase === PHASES.VOTING ? (
        <VotingPhase
          proposal={proposal}
          tally={tally}
          myVote={lifecycle.myVote}
          onVote={castVote}
          resolveAuthor={resolveAuthor}
        />
      ) : null}

      {phase === PHASES.CLOSED ||
      phase === PHASES.IMPLEMENTED ||
      phase === PHASES.WITHDRAWN ? (
        <ClosedPhase
          proposal={proposal}
          phase={phase}
          tally={tally}
          lifecycle={lifecycle}
          resolveAuthor={resolveAuthor}
          onMarkImplemented={markImplemented}
          onAddComment={addComment}
        />
      ) : null}

      {phase === PHASES.DRAFT && lifecycle.isAuthor ? (
        <section className="rounded-3xl border border-dashed border-brand/25 bg-page/60 p-5">
          <p className="font-ui text-sm tracking-[0.03em] text-brand/75">
            This is a draft, only visible to you. Publish it to open it up for
            peer discussion.
          </p>
        </section>
      ) : null}
    </article>
  );
}

/**
 * Discussion phase — comment list + composer. Comments are the whole
 * event here.
 */
const DiscussionPhase = ({ proposal, resolveAuthor, onAddComment }) => (
  <section
    aria-label="Discussion"
    className="space-y-4 rounded-3xl border border-brand/15 bg-cream p-5 md:p-6"
  >
    <header>
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        Discussion
      </p>
      <p className="mt-1 font-body text-sm text-brand/65">
        Share thinking, raise objections, ask for clarification.
      </p>
    </header>

    <CommentList comments={proposal.comments} resolveAuthor={resolveAuthor} />

    <div className="border-t border-brand/10 pt-4">
      <CommentComposer onSubmit={onAddComment} />
    </div>
  </section>
);

/**
 * Voting phase — ballot + live status. Comments from discussion show in a
 * collapsed read-only panel so peers can revisit arguments before voting.
 */
const VotingPhase = ({ proposal, tally, myVote, onVote, resolveAuthor }) => (
  <>
    <VoteStatus
      deadline={proposal.votingDeadline}
      totalVotes={tally.counts.total}
      quorumThreshold={tally.quorumThreshold}
    />

    <section
      aria-label="Your vote"
      className="space-y-3 rounded-3xl border border-brand/15 bg-cream p-5 md:p-6"
    >
      <header>
        <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
          Your vote
        </p>
      </header>
      <Ballot myVote={myVote} onVote={onVote} />
    </section>

    {proposal.comments?.length ? (
      <details className="group rounded-3xl border border-brand/12 bg-page/60 p-5">
        <summary className="cursor-pointer list-none font-ui text-sm tracking-[0.04em] text-brand/75 transition hover:text-brand">
          <span className="inline-flex items-center gap-2">
            <span
              className="transition group-open:rotate-90"
              aria-hidden="true"
            >
              ▸
            </span>
            Discussion from before voting
          </span>
        </summary>
        <div className="mt-3 border-t border-brand/10 pt-3">
          <CommentList
            comments={proposal.comments}
            resolveAuthor={resolveAuthor}
          />
        </div>
      </details>
    ) : null}
  </>
);

const AttachmentPreviewModal = ({
  attachment,
  imageZoom,
  onImageZoomChange,
  onClose,
}) => {
  const kind = getAttachmentKind(attachment);
  const textContent = useMemo(
    () => (kind === "text" ? decodeDataUrlText(attachment?.dataUrl) : ""),
    [attachment?.dataUrl, kind],
  );

  return (
    <Modal
      isOpen={Boolean(attachment)}
      onClose={onClose}
      title={attachment?.name ?? "Attachment preview"}
      ariaLabel={attachment?.name ?? "Attachment preview"}
      size="lg"
    >
      {attachment ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-body text-xs text-brand/60">
              {attachment.type || "application/octet-stream"} ·{" "}
              {formatBytes(attachment.size)}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={attachment.dataUrl}
                download={attachment.name}
                className="rounded-full border border-brand/20 px-3 py-1.5 font-ui text-[0.62rem] tracking-[0.06em] text-brand/70 transition hover:border-brand/35 hover:text-brand"
              >
                Download
              </a>
              <a
                href={attachment.dataUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-brand/20 px-3 py-1.5 font-ui text-[0.62rem] tracking-[0.06em] text-brand/70 transition hover:border-brand/35 hover:text-brand"
              >
                Open tab
              </a>
            </div>
          </div>

          {kind === "image" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onImageZoomChange((zoom) => Math.max(0.5, zoom - 0.25))
                  }
                  className="rounded-lg border border-brand/18 px-3 py-1 font-body text-sm text-brand"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onImageZoomChange(1)}
                  className="rounded-lg border border-brand/18 px-3 py-1 font-body text-sm text-brand"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onImageZoomChange((zoom) => Math.min(4, zoom + 0.25))
                  }
                  className="rounded-lg border border-brand/18 px-3 py-1 font-body text-sm text-brand"
                >
                  +
                </button>
                <p className="font-body text-xs text-brand/62">
                  Zoom {Math.round(imageZoom * 100)}%
                </p>
              </div>
              <div className="max-h-[68vh] overflow-auto rounded-2xl border border-brand/12 bg-page p-3">
                <img
                  src={attachment.dataUrl}
                  alt={attachment.name}
                  className="mx-auto origin-top"
                  style={{ transform: `scale(${imageZoom})` }}
                />
              </div>
            </div>
          ) : null}

          {kind === "video" ? (
            <video
              src={attachment.dataUrl}
              controls
              preload="metadata"
              className="max-h-[70vh] w-full rounded-2xl border border-brand/12 bg-black object-contain"
            />
          ) : null}

          {kind === "audio" ? (
            <div className="rounded-2xl border border-brand/12 bg-page p-4">
              <audio
                src={attachment.dataUrl}
                controls
                className="w-full"
                preload="metadata"
              />
            </div>
          ) : null}

          {kind === "pdf" ? (
            <iframe
              title={attachment.name}
              src={attachment.dataUrl}
              className="h-[70vh] w-full rounded-2xl border border-brand/12"
            />
          ) : null}

          {kind === "text" ? (
            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-brand/12 bg-page p-4">
              <pre className="whitespace-pre-wrap wrap-break-word font-body text-sm leading-relaxed text-brand/82">
                {textContent ||
                  "Unable to preview this text file. Use Download or Open tab."}
              </pre>
            </div>
          ) : null}

          {kind === "file" ? (
            <p className="font-body text-sm text-brand/72">
              This file type cannot be previewed inline. Use Open tab or
              Download.
            </p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
};

/**
 * Closed / Implemented / Withdrawn phase — the outcome record.
 */
const ClosedPhase = ({
  proposal,
  phase,
  tally,
  lifecycle,
  resolveAuthor,
  onMarkImplemented,
  onAddComment,
}) => (
  <>
    <OutcomeBanner
      outcome={tally.outcome}
      reachedQuorum={tally.reachedQuorum}
      counts={tally.counts}
      closedAt={proposal.closedAt}
      deadline={proposal.votingDeadline}
    />

    {phase !== PHASES.WITHDRAWN ? (
      <section
        aria-label="Vote breakdown"
        className="rounded-3xl border border-brand/15 bg-cream p-5 md:p-6"
      >
        <VoteBreakdown
          votes={proposal.votes}
          counts={tally.counts}
          resolveAuthor={resolveAuthor}
        />
      </section>
    ) : null}

    <ImplementationCard
      phase={phase}
      isAuthor={lifecycle.isAuthor}
      implementationNote={proposal.implementationNote}
      implementedAt={proposal.implementedAt}
      onMarkImplemented={onMarkImplemented}
    />

    {phase !== PHASES.WITHDRAWN ? (
      <section
        aria-label="Post-vote reflection"
        className="space-y-4 rounded-3xl border border-brand/15 bg-cream p-5 md:p-6"
      >
        <header>
          <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
            Reflections
          </p>
          <p className="mt-1 font-body text-sm text-brand/65">
            Comments reopen after voting closes. Reflect on the outcome or
            suggest what comes next.
          </p>
        </header>

        <CommentList
          comments={proposal.comments}
          resolveAuthor={resolveAuthor}
        />

        <div className="border-t border-brand/10 pt-4">
          <CommentComposer
            onSubmit={onAddComment}
            placeholder="Your thoughts on the outcome"
          />
        </div>
      </section>
    ) : null}
  </>
);

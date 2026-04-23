import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSOARState } from "../../../hooks/useSOARState";
import { ProposalForm } from "../components/compose/ProposalForm";
import { useProposalLifecycle } from "../hooks/useProposalLifecycle";

/**
 * Author-only edit page for drafts and discussion-phase proposals.
 * Redirects away if:
 *   - proposal doesn't exist
 *   - viewer isn't the author
 *   - proposal is in a phase that doesn't allow edits (voting, closed, etc.)
 */
export default function ProposalEdit() {
  const { proposalId } = useParams();
  const [state, dispatch] = useSOARState();
  const navigate = useNavigate();

  const proposal = useMemo(
    () => (state.forum ?? []).find((p) => p.id === proposalId),
    [state.forum, proposalId],
  );

  const lifecycle = useProposalLifecycle({
    proposal,
    currentUserId: state.user.id,
  });

  const saveChanges = useCallback(
    ({ title, description, attachments }) => {
      dispatch({
        type: "UPSERT_PROPOSAL",
        payload: { id: proposal.id, title, description, attachments },
      });
      navigate(`/forum/${proposal.id}`);
    },
    [dispatch, navigate, proposal],
  );

  if (!proposal) return <Navigate to="/forum/all" replace />;
  if (!lifecycle?.isAuthor)
    return <Navigate to={`/forum/${proposal.id}`} replace />;
  if (!lifecycle.authorCanEdit)
    return <Navigate to={`/forum/${proposal.id}`} replace />;

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)] md:p-8">
      <header className="mb-5">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-brand/55">
          Edit proposal
        </p>
        <h2 className="mt-1 font-display text-3xl leading-tight text-brand">
          {proposal.title || "Untitled proposal"}
        </h2>
      </header>

      <ProposalForm
        initialTitle={proposal.title}
        initialDescription={proposal.description}
        initialAttachments={proposal.attachments ?? []}
        primaryLabel="Save changes"
        onPrimary={saveChanges}
        onCancel={() => navigate(`/forum/${proposal.id}`)}
        isEdit
      />
    </section>
  );
}

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSOARDispatch, useSOARState } from "../../../store";
import { ProposalForm } from "../components/compose/ProposalForm";

/**
 * Draft composer. Two exit paths:
 *   - Save draft    → dispatches UPSERT_PROPOSAL, routes to /forum/drafts
 *   - Publish now   → dispatches UPSERT_PROPOSAL then PUBLISH_PROPOSAL,
 *                     routes to the new proposal's detail page
 *
 * We generate the ID here so both dispatches target the same proposal —
 * passing `id` into UPSERT on a brand-new proposal is how we make the two
 * actions composable. ID format matches the pattern used elsewhere in the
 * store (prefix_suffix).
 */
const generateProposalId = () => {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `proposal_${stamp}${random}`;
};
export default function NewProposalTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const navigate = useNavigate();
  const proposalIdRef = useRef(generateProposalId());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveDraft = useCallback(
    ({ title, description, attachments }) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const id = proposalIdRef.current;
      dispatch({
        type: "UPSERT_PROPOSAL",
        payload: {
          id,
          title,
          description,
          attachments,
          authorId: state.user.id,
        },
      });
      navigate("/forum/drafts");
    },
    [dispatch, isSubmitting, navigate, state.user.id],
  );

  const publishNow = useCallback(
    ({ title, description, attachments }) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const id = proposalIdRef.current;
      dispatch({
        type: "UPSERT_PROPOSAL",
        payload: {
          id,
          title,
          description,
          attachments,
          authorId: state.user.id,
        },
      });
      dispatch({ type: "PUBLISH_PROPOSAL", payload: { id } });
      navigate(`/forum/${id}`);
    },
    [dispatch, isSubmitting, navigate, state.user.id],
  );

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)] md:p-8">
      <header className="mb-5">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-brand/55">
          New proposal
        </p>
        <h2 className="mt-1 font-display text-3xl leading-tight text-brand">
          Start a proposal
        </h2>
      </header>

      <ProposalForm
        primaryLabel="Publish for discussion"
        secondaryLabel="Save draft"
        onPrimary={publishNow}
        onSecondary={saveDraft}
        onCancel={() => navigate(-1)}
        submitting={isSubmitting}
      />
    </section>
  );
}

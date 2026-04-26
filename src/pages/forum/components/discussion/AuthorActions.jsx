import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";
import { OpenVotingDialog } from "../compose/OpenVotingDialog";
import { WithdrawDialog } from "../compose/WithdrawDialog";
import { DeleteDraftDialog } from "../compose/DeleteDraftDialog";

/**
 * Author-only action bar. Shown at the top of the proposal detail when
 * the viewer is the author AND the proposal is still mutable (draft or
 * discussion phase). Wraps the two modal dialogs so the parent doesn't
 * need to know they exist.
 *
 * Affordances are passed in as booleans from useProposalLifecycle;
 * single source of truth for "what can the author do right now."
 */
export const AuthorActions = ({
  proposalId,
  phase,
  canEdit,
  canPublish,
  canOpenVoting,
  canWithdraw,
  canDelete,
  onPublish,
  onOpenVoting,
  onWithdraw,
  onDelete,
}) => {
  const [votingDialog, setVotingDialog] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex flex-wrap sm:items-center gap-2 sm:rounded-2xl sm:border sm:border-brand/15 sm:bg-cream/70 sm:p-3">
        <p className="mr-auto font-body text-xs uppercase tracking-[0.14em] hidden sm:block text-brand/55">
          Your proposal
        </p>

        {canEdit ? (
          <Link
            to={`/forum/${proposalId}/edit`}
            className="inline-flex items-center rounded-full border border-brand/20 px-3 py-1.5 font-ui text-xs tracking-[0.06em] text-brand transition hover:border-brand/35"
          >
            Edit
          </Link>
        ) : null}

        {canPublish ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            fullWidth={false}
            text="Publish"
            onClick={onPublish}
          />
        ) : null}

        {canOpenVoting ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            fullWidth={false}
            text="Open voting"
            onClick={() => setVotingDialog(true)}
          />
        ) : null}

        {canWithdraw ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            fullWidth={false}
            text="Withdraw"
            onClick={() => setWithdrawDialog(true)}
          />
        ) : null}

        {canDelete ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            fullWidth={false}
            text="Delete draft"
            onClick={() => setDeleteDialog(true)}
          />
        ) : null}
      </div>

      <OpenVotingDialog
        isOpen={votingDialog}
        onClose={() => setVotingDialog(false)}
        onConfirm={(deadline) => {
          setVotingDialog(false);
          onOpenVoting(deadline);
        }}
      />

      <WithdrawDialog
        isOpen={withdrawDialog}
        onClose={() => setWithdrawDialog(false)}
        onConfirm={onWithdraw}
        phase={phase}
      />

      <DeleteDraftDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={() => {
          setDeleteDialog(false);
          onDelete?.();
        }}
      />
    </>
  );
};

import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../components/Button";

/**
 * Confirmation dialog for withdrawing a proposal.
 */
export const WithdrawDialog = ({ isOpen, onClose, onConfirm, phase }) => {
  const messages = {
    discussion:
      "The proposal will be marked as withdrawn and can't be published again. Comments will remain visible for context.",
    voting:
      "Voting closes immediately. Any votes already cast will be revealed in the final record, but the outcome will be marked as Withdrawn rather than passed or rejected.",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Withdraw this proposal?"
      ariaLabel="Confirm withdraw"
      size="sm"
    >
      <p className="font-body text-sm leading-relaxed text-brand/80">
        {messages[phase] ??
          "The proposal will be marked as withdrawn. This can't be undone."}
      </p>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          text="Keep it open"
          onClick={onClose}
        />
        <Button
          type="button"
          variant="danger"
          size="sm"
          fullWidth={false}
          text="Withdraw"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        />
      </div>
    </Modal>
  );
};

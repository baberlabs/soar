import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../components/Button";

/**
 * Confirmation dialog for permanent draft deletion.
 * This is intentionally limited to drafts to keep governance history intact.
 */
export const DeleteDraftDialog = ({ isOpen, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Delete this draft?"
    ariaLabel="Confirm delete draft"
    size="sm"
  >
    <p className="font-body text-sm leading-relaxed text-brand/80">
      This will permanently remove the draft and its attachments. Published
      proposals cannot be deleted to preserve governance records.
    </p>

    <div className="mt-6 flex flex-wrap justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        fullWidth={false}
        text="Cancel"
        onClick={onClose}
      />
      <Button
        type="button"
        variant="danger"
        size="sm"
        fullWidth={false}
        text="Delete draft"
        onClick={onConfirm}
      />
    </div>
  </Modal>
);

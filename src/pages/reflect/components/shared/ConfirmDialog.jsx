import { Button } from "../../../../components/Button";
import { Modal } from "../../../../components/Modal";

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  tone,
  onConfirm,
  onCancel,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    size="sm"
    dismissOnOverlay={false}
  >
    <p className="font-body text-base leading-relaxed text-brand/80">
      {message}
    </p>
    <div className="mt-6 flex justify-end gap-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        fullWidth={false}
        text={cancelText}
        onClick={onCancel}
      />
      <Button
        type="button"
        variant={tone === "danger" ? "danger" : "primary"}
        size="sm"
        fullWidth={false}
        text={confirmText}
        onClick={onConfirm}
      />
    </div>
  </Modal>
);

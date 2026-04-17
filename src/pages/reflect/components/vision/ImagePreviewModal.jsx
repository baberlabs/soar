import { Modal } from "../shared/Modal";

export const ImagePreviewModal = ({ image, onClose }) => (
  <Modal
    isOpen={Boolean(image)}
    onClose={onClose}
    ariaLabel={image?.alt ?? "Moodboard image"}
    size="lg"
  >
    {image ? (
      <div className="flex flex-col items-center gap-4">
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
        />
        {image.alt ? (
          <p className="font-body text-sm text-brand/70">{image.alt}</p>
        ) : null}
      </div>
    ) : null}
  </Modal>
);

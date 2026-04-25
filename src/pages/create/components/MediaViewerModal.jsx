import { useEffect } from "react";
import { Download, X } from "lucide-react";
import { renderCreationMedia, isExpandableMedia } from "../utils/media.jsx";

export const MediaViewerModal = ({ creation, onClose }) => {
  useEffect(() => {
    if (!creation) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [creation, onClose]);

  if (!creation || !isExpandableMedia(creation)) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-navy/72 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded media viewer"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-cream/90"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand/12 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-ui text-base text-brand">
              {creation.title}
            </p>
            <p className="truncate font-body text-xs text-brand/62">
              {creation.media}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {creation.previewData ? (
              <a
                href={creation.previewData}
                download={creation.media || "attachment"}
                className="rounded-lg border border-brand/18 bg-page p-2 hover:bg-brand/6"
                aria-label="Download"
                title="Download"
              >
                <Download size={18} strokeWidth={1.5} className="text-brand" />
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-brand/18 bg-page p-2 hover:bg-brand/6"
              aria-label="Close"
              title="Close"
            >
              <X size={18} strokeWidth={1.5} className="text-brand" />
            </button>
          </div>
        </div>

        <div className="max-h-[76vh] overflow-auto p-5">
          {creation.mediaKind === "image" && creation.previewData ? (
            <img
              src={creation.previewData}
              alt={creation.title}
              className="mx-auto max-h-[68vh] w-auto rounded-xl object-contain"
            />
          ) : (
            renderCreationMedia(creation, {
              className: "mx-auto max-h-[68vh] w-full rounded-xl",
            })
          )}
        </div>
      </div>
    </div>
  );
};

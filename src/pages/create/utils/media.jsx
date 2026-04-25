export const MEDIA_KIND_LABELS = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  document: "Document",
  other: "File",
};

export const getMediaLabel = (kind) =>
  MEDIA_KIND_LABELS[kind] ?? MEDIA_KIND_LABELS.other;

export const getFileKind = (file) => {
  if (!file) return "other";
  const type = file.type || "";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";

  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument",
    "application/vnd.ms-",
    "text/",
  ];
  if (documentTypes.some((prefix) => type.startsWith(prefix))) {
    return "document";
  }
  // Common doc extensions when MIME is missing or generic.
  if (/\.(pdf|docx?|pptx?|xlsx?|txt|rtf|md)$/i.test(file.name)) {
    return "document";
  }
  return "other";
};

export const isTextDocument = (fileName, mediaType) => {
  if (mediaType.startsWith("text/")) return true;
  return /\.(txt|md|rtf)$/i.test(fileName);
};

export const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

export const fileToText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file);
  });

export const hasRenderableMedia = (creation) => {
  if (!creation) return false;
  if (creation.mediaKind === "image" && creation.previewData) return true;
  if (creation.mediaKind === "video" && creation.previewData) return true;
  if (creation.mediaKind === "audio" && creation.previewData) return true;
  if (creation.mediaKind === "document") {
    if (creation.textPreview) return true;
    if (creation.previewData && (creation.mediaType ?? "").includes("pdf")) {
      return true;
    }
    if (creation.previewData) return true;
  }
  return false;
};

export const isExpandableMedia = (creation) => {
  if (!creation) return false;
  if (!hasRenderableMedia(creation)) return false;
  return creation.mediaKind === "image" || creation.mediaKind === "document";
};

/**
 * Render a creation's media. Returns null when the creation has no
 * renderable preview (e.g. peer-directory entries without files).
 */
export const renderCreationMedia = (creation, { className = "" } = {}) => {
  const mediaName = creation.media ?? "Shared file";
  const mediaType = creation.mediaType ?? "";
  const mediaKind = creation.mediaKind ?? "other";
  const previewData = creation.previewData ?? "";
  const textPreview = creation.textPreview ?? "";

  if (mediaKind === "image" && previewData) {
    return (
      <img
        src={previewData}
        alt={creation.title || mediaName}
        className={`${className} object-cover`}
      />
    );
  }

  if (mediaKind === "video" && previewData) {
    return (
      <video
        src={previewData}
        controls
        preload="metadata"
        className={`${className} bg-black object-contain`}
      />
    );
  }

  if (mediaKind === "audio" && previewData) {
    return (
      <div className="flex h-32 items-center justify-center px-4">
        <audio
          src={previewData}
          controls
          className="w-full"
          preload="metadata"
        />
      </div>
    );
  }

  if (mediaKind === "document") {
    if (textPreview) {
      return (
        <div className="max-h-56 overflow-auto p-4 text-left">
          <pre className="whitespace-pre-wrap wrap-break-word font-body text-sm leading-relaxed text-brand/82">
            {textPreview}
          </pre>
        </div>
      );
    }

    if (previewData && mediaType.includes("pdf")) {
      return (
        <iframe
          title={creation.title || mediaName}
          src={previewData}
          className={className}
        />
      );
    }

    if (previewData) {
      return (
        <div className="flex h-32 items-center justify-center px-4">
          <a
            href={previewData}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-brand/18 px-4 py-2 font-body text-sm text-brand hover:bg-brand/6"
          >
            Open document
          </a>
        </div>
      );
    }
  }

  return null;
};

/**
 * Compact relative-time formatter — "today", "3d ago", "2w ago", or a
 * short date if older. Used by network feed and comments.
 */
export const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

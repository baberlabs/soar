export const getAttachmentKind = (attachment) => {
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

export const canPreviewAttachment = (attachment) =>
  ["image", "video", "audio", "pdf", "text"].includes(
    getAttachmentKind(attachment),
  );

export const decodeDataUrlText = (dataUrl) => {
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

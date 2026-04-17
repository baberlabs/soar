import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { useSOARState } from "../../hooks/useSOARState";

export default function Create() {
  const [state, dispatch] = useSOARState();
  const [searchParams] = useSearchParams();
  const requestedSubject = searchParams.get("subject");
  const [step, setStep] = useState(() =>
    requestedSubject ? "upload" : "gallery",
  );
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [subjectId, setSubjectId] = useState(() => requestedSubject ?? "");
  const [fileName, setFileName] = useState("");
  const [fileKind, setFileKind] = useState("");
  const [fileType, setFileType] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [fileTextPreview, setFileTextPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [viewerCreation, setViewerCreation] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);

  const creationSubjects = useMemo(
    () =>
      state.curriculum
        .map((entry) =>
          state.subjects.find((subject) => subject.id === entry.subjectId),
        )
        .filter(Boolean),
    [state.curriculum, state.subjects],
  );

  const selectedSubjectId = subjectId || creationSubjects[0]?.id || "";

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (files?.length) {
      await setSelectedFile(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("bg-brand/10", "border-brand");
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove("bg-brand/10", "border-brand");
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove("bg-brand/10", "border-brand");

    const files = event.dataTransfer.files;
    if (files?.length) {
      await setSelectedFile(files[0]);
    }
  };

  const setSelectedFile = async (file) => {
    setFileName(file.name);
    const kind = getFileKind(file);
    const normalizedType = file.type || "application/octet-stream";

    setFileKind(kind);
    setFileType(normalizedType);

    if (
      kind === "image" ||
      kind === "video" ||
      kind === "audio" ||
      kind === "document"
    ) {
      try {
        const preview = await fileToDataURL(file);
        setFilePreview(preview);
      } catch {
        setFilePreview("");
      }
    } else {
      setFilePreview("");
    }

    if (isTextDocument(file.name, normalizedType)) {
      try {
        const text = await fileToText(file);
        setFileTextPreview(text.slice(0, 3500));
      } catch {
        setFileTextPreview("");
      }
    } else {
      setFileTextPreview("");
    }

    setError("");
  };

  const handleUpload = (event) => {
    event.preventDefault();

    if (!title.trim() || !fileName) {
      setError("Add a title and choose a file before sharing your creation.");
      return;
    }

    setError("");
    setIsUploading(true);

    setTimeout(() => {
      dispatch({
        type: "ADD_CREATION",
        payload: {
          id: `creation_${Date.now()}`,
          title: title.trim(),
          media: fileName,
          mediaKind: fileKind || "other",
          mediaType: fileType || "application/octet-stream",
          previewData: filePreview || null,
          textPreview: fileTextPreview || null,
          note: note.trim(),
          date: new Date().toLocaleDateString(),
          subjectId: selectedSubjectId || null,
        },
      });

      setTitle("");
      setNote("");
      setFileName("");
      setFileKind("");
      setFileType("");
      setFilePreview("");
      setFileTextPreview("");
      setIsUploading(false);
      setStep("gallery");
    }, 700);
  };

  const handleOpenViewer = (creation) => {
    if (!isExpandableMedia(creation)) return;
    setViewerCreation(creation);
    setImageZoom(1);
  };

  const handleCloseViewer = () => {
    setViewerCreation(null);
    setImageZoom(1);
  };

  useEffect(() => {
    if (!viewerCreation) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseViewer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerCreation]);

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Create
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Turn learning into evidence. Save a draft, an image, a recording, or
            a note that shows what changed because you spent time with a
            subject.
          </p>
        </header>

        <div className="flex gap-2 border-b border-navy/10">
          <button
            type="button"
            onClick={() => setStep("gallery")}
            className={`font-ui px-4 py-3 transition-colors ${
              step === "gallery"
                ? "border-b-2 border-brand text-navy"
                : "text-brand/70 hover:text-navy"
            }`}
          >
            Gallery ({state.creations.length})
          </button>
          <button
            type="button"
            onClick={() => setStep("upload")}
            className={`font-ui px-4 py-3 transition-colors ${
              step === "upload"
                ? "border-b-2 border-brand text-navy"
                : "text-brand/70 hover:text-navy"
            }`}
          >
            Share New
          </button>
        </div>

        {step === "gallery" ? (
          <section className="space-y-6">
            {state.creations.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-brand/24 bg-page p-12 text-center">
                <p className="font-body text-brand/76">
                  Nothing shared yet. Your subject paths get stronger when they
                  leave behind drafts, images, or notes you can point to later.
                </p>
                <Button
                  className="mx-auto mt-5 sm:w-auto"
                  onClick={() => setStep("upload")}
                >
                  Share Your First Creation
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.creations
                  .slice()
                  .reverse()
                  .map((creation) => {
                    const subject = state.subjects.find(
                      (entry) => entry.id === creation.subjectId,
                    );

                    return (
                      <article
                        key={creation.id}
                        className="overflow-hidden rounded-[1.75rem] border border-brand/12 bg-cream"
                      >
                        <div className="relative bg-brand/8">
                          {renderCreationMedia(creation, {
                            className: "h-44 w-full",
                          })}
                          {!hasRenderableMedia(creation) ? (
                            <div className="flex h-32 items-center justify-center px-4">
                              <div className="text-center">
                                <p className="font-ui text-xs tracking-[0.12em] text-brand/65">
                                  {getMediaLabel(creation.mediaKind)}
                                </p>
                                <p className="mt-1 line-clamp-2 font-body text-sm text-brand/80">
                                  {creation.media}
                                </p>
                              </div>
                            </div>
                          ) : null}
                          {isExpandableMedia(creation) ? (
                            <button
                              type="button"
                              onClick={() => handleOpenViewer(creation)}
                              className="absolute right-3 top-3 rounded-full bg-white/92 px-3 py-1 font-body text-xs text-brand shadow-sm hover:bg-white"
                            >
                              Expand
                            </button>
                          ) : null}
                        </div>

                        <div className="space-y-2 p-5">
                          <h2 className="font-ui text-2xl text-brand">
                            {creation.title}
                          </h2>
                          {subject ? (
                            <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
                              {subject.name}
                            </p>
                          ) : null}
                          {creation.mediaType ? (
                            <p className="font-body text-xs text-brand/55">
                              {creation.mediaType}
                            </p>
                          ) : null}
                          {creation.note ? (
                            <p className="font-body text-sm leading-relaxed text-brand/76">
                              {creation.note}
                            </p>
                          ) : null}
                          <p className="font-body text-xs text-brand/55">
                            {creation.date}
                          </p>
                        </div>
                      </article>
                    );
                  })}
              </div>
            )}
          </section>
        ) : (
          <section className="mx-auto max-w-3xl space-y-6 rounded-[1.75rem] border border-brand/12 bg-white/72 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.06)] backdrop-blur-sm">
            <div className="space-y-2">
              <h2 className="font-ui text-3xl text-brand">Share a creation</h2>
              <p className="font-body text-sm leading-relaxed text-brand/72">
                Keep evidence of your work attached to a subject path.
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="rounded-3xl border-2 border-dashed border-brand/25 bg-page p-10 text-center transition-colors hover:border-brand/45"
              >
                <label className="cursor-pointer">
                  <div className="space-y-2">
                    <p className="font-ui text-sm tracking-[0.12em] text-brand">
                      Drag a file here or click to browse
                    </p>
                    <p className="font-body text-xs text-brand/62">
                      Images, audio, video, PDFs, notes, or documents.
                    </p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.md"
                    />
                  </div>
                </label>

                {fileName ? (
                  <div className="mt-4 rounded-2xl bg-brand/8 p-3 text-left">
                    <p className="font-body text-sm text-navy">{fileName}</p>
                    <p className="mt-1 font-body text-xs text-brand/62">
                      {fileKind ? getMediaLabel(fileKind) : "File"}
                      {fileType ? ` • ${fileType}` : ""}
                    </p>
                  </div>
                ) : null}

                {filePreview || fileTextPreview ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-brand/12 bg-white">
                    {renderCreationMedia(
                      {
                        title: fileName || "Selected upload",
                        media: fileName,
                        mediaKind: fileKind,
                        mediaType: fileType,
                        previewData: filePreview,
                        textPreview: fileTextPreview,
                      },
                      { className: "mx-auto max-h-72 w-full" },
                    )}
                  </div>
                ) : null}
              </div>

              <InputField
                label="Title"
                name="creation-title"
                placeholder="Give your creation a name"
                value={title}
                onValueChange={setTitle}
              />

              {creationSubjects.length > 0 ? (
                <div>
                  <label
                    className="font-body text-sm text-navy/70"
                    htmlFor="creation-subject"
                  >
                    Related subject
                  </label>
                  <select
                    id="creation-subject"
                    value={selectedSubjectId}
                    onChange={(event) => setSubjectId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 font-body text-base text-navy outline-none transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/15"
                  >
                    <option value="">None</option>
                    {creationSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label
                  className="font-body text-sm text-navy/70"
                  htmlFor="creation-note"
                >
                  What changed because you made this?
                </label>
                <textarea
                  id="creation-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="A short note about the process, the result, or what you learned."
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/15"
                  rows="4"
                />
              </div>

              {error ? (
                <p className="font-body text-sm text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => setStep("gallery")}
                  disabled={isUploading}
                >
                  Back To Gallery
                </Button>
                <Button
                  type="submit"
                  fullWidth={false}
                  disabled={isUploading}
                  status={isUploading ? "loading" : "idle"}
                  loadingText="Saving..."
                  text="Save Creation"
                />
              </div>
            </form>
          </section>
        )}
      </div>

      {viewerCreation ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-navy/72 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded media viewer"
          onClick={handleCloseViewer}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand/12 px-5 py-4">
              <div>
                <p className="font-ui text-base text-brand">
                  {viewerCreation.title}
                </p>
                <p className="font-body text-xs text-brand/62">
                  {viewerCreation.media}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {viewerCreation.previewData ? (
                  <a
                    href={viewerCreation.previewData}
                    download={viewerCreation.media || "attachment"}
                    className="rounded-xl border border-brand/18 bg-page px-3 py-2 font-body text-xs text-brand hover:bg-brand/6"
                  >
                    Download
                  </a>
                ) : null}
                {viewerCreation.previewData ? (
                  <a
                    href={viewerCreation.previewData}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-brand/18 bg-page px-3 py-2 font-body text-xs text-brand hover:bg-brand/6"
                  >
                    Open In New Tab
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={handleCloseViewer}
                  className="rounded-xl border border-brand/18 bg-page px-3 py-2 font-body text-xs text-brand hover:bg-brand/6"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[76vh] overflow-auto p-5">
              {viewerCreation.mediaKind === "image" &&
              viewerCreation.previewData ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setImageZoom((zoom) => Math.max(0.5, zoom - 0.25))
                      }
                      className="rounded-lg border border-brand/18 px-3 py-1 font-body text-sm text-brand"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageZoom(1)}
                      className="rounded-lg border border-brand/18 px-3 py-1 font-body text-sm text-brand"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setImageZoom((zoom) => Math.min(4, zoom + 0.25))
                      }
                      className="rounded-lg border border-brand/18 px-3 py-1 font-body text-sm text-brand"
                    >
                      +
                    </button>
                    <p className="font-body text-xs text-brand/62">
                      Zoom {Math.round(imageZoom * 100)}%
                    </p>
                  </div>
                  <div className="overflow-auto rounded-2xl border border-brand/12 bg-page p-3">
                    <img
                      src={viewerCreation.previewData}
                      alt={viewerCreation.title || viewerCreation.media}
                      className="mx-auto origin-top"
                      style={{ transform: `scale(${imageZoom})` }}
                    />
                  </div>
                </div>
              ) : null}

              {viewerCreation.mediaKind === "document" ? (
                <div className="space-y-4">
                  {viewerCreation.textPreview ? (
                    <div className="max-h-[68vh] overflow-auto rounded-2xl border border-brand/12 bg-page p-4">
                      <pre className="whitespace-pre-wrap wrap-break-word font-body text-sm leading-relaxed text-brand/82">
                        {viewerCreation.textPreview}
                      </pre>
                    </div>
                  ) : null}

                  {!viewerCreation.textPreview &&
                  viewerCreation.previewData &&
                  viewerCreation.mediaType?.includes("pdf") ? (
                    <iframe
                      title={viewerCreation.title || viewerCreation.media}
                      src={viewerCreation.previewData}
                      className="h-[70vh] w-full rounded-2xl border border-brand/12"
                    />
                  ) : null}

                  {!viewerCreation.textPreview &&
                  !viewerCreation.mediaType?.includes("pdf") ? (
                    <p className="font-body text-sm text-brand/72">
                      This document type may not render inline in every browser.
                      Use Open In New Tab or Download for full reading.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Preview read failed"));
    reader.readAsDataURL(file);
  });

const fileToText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Text read failed"));
    reader.readAsText(file);
  });

const getFileKind = (file) => {
  const mime = file.type?.toLowerCase() ?? "";
  const name = file.name?.toLowerCase() ?? "";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";

  if (/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|rtf|md)$/.test(name)) {
    return "document";
  }

  return "other";
};

const isTextDocument = (name, mimeType) => {
  const lowerName = name?.toLowerCase() ?? "";
  const lowerMime = mimeType?.toLowerCase() ?? "";
  if (lowerMime.startsWith("text/")) return true;
  return /\.(txt|md|rtf)$/.test(lowerName);
};

const getMediaLabel = (kind) => {
  const labels = {
    image: "IMAGE",
    video: "VIDEO",
    audio: "VOICE / AUDIO",
    document: "DOCUMENT",
    other: "FILE",
  };

  return labels[kind] ?? "FILE";
};

const hasRenderableMedia = (creation) =>
  Boolean(creation?.previewData || creation?.textPreview);

const isExpandableMedia = (creation) =>
  Boolean(
    creation &&
    (creation.mediaKind === "image" || creation.mediaKind === "document") &&
    (creation.previewData || creation.textPreview),
  );

const renderCreationMedia = (creation, { className = "" } = {}) => {
  if (!creation) return null;

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
          className={`${className} bg-white`}
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
            className="rounded-xl border border-brand/18 bg-white px-4 py-2 font-body text-sm text-brand hover:bg-brand/6"
          >
            Open document
          </a>
        </div>
      );
    }
  }

  return null;
};

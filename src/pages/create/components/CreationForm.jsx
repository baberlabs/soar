import { useState } from "react";
import { Button } from "../../../components/Button";
import { InputField } from "../../../components/InputField";
import {
  fileToDataURL,
  fileToText,
  getFileKind,
  getMediaLabel,
  isTextDocument,
  renderCreationMedia,
} from "../utils/media.jsx";

export const CreationForm = ({
  enrolledSubjects = [],
  requestedSubjectId,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [subjectId, setSubjectId] = useState(() => requestedSubjectId ?? "");
  const [fileName, setFileName] = useState("");
  const [fileKind, setFileKind] = useState("");
  const [fileType, setFileType] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [fileTextPreview, setFileTextPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedSubjectId = subjectId || enrolledSubjects[0]?.id || "";

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (files?.length) await setSelectedFile(files[0]);
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
    if (files?.length) await setSelectedFile(files[0]);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !fileName) {
      setError("Add a title and choose a file before sharing your creation.");
      return;
    }

    setError("");
    setIsSaving(true);

    // Brief delay simulates the file write to the IPFS node so the
    // Saving... state is actually visible.
    setTimeout(() => {
      onSubmit({
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
      });

      setIsSaving(false);
    }, 700);
  };

  return (
    <section className="rounded-[1.75rem] border border-brand/12 bg-cream p-6 md:p-8">
      <header className="mb-5 space-y-1">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
          Add to gallery
        </p>
        <h2 className="font-ui text-2xl text-brand">Share a new creation</h2>
        <p className="font-body text-sm text-brand/72">
          Upload a file, title it, and add a note. Optionally tag the subject it
          came from.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="mt-4 overflow-hidden rounded-2xl border border-brand/12">
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

        {enrolledSubjects.length > 0 ? (
          <div>
            <label
              htmlFor="creation-subject"
              className="block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
            >
              Subject
              <span className="ml-1 text-brand/45">(optional)</span>
            </label>
            <select
              id="creation-subject"
              value={selectedSubjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-brand/16 bg-cream px-4 py-3 font-body text-sm text-brand focus:border-brand/40 focus:outline-none"
            >
              <option value="">No subject</option>
              {enrolledSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label
            htmlFor="creation-note"
            className="block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
          >
            Note
            <span className="ml-1 text-brand/45">(optional)</span>
          </label>
          <textarea
            id="creation-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What did you make? What did it teach you?"
            className="mt-2 min-h-32 w-full rounded-2xl border border-brand/16 bg-cream px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 font-body text-sm text-brand">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 border-t border-brand/10 pt-5">
          {onCancel ? (
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              text="Cancel"
              onClick={onCancel}
            />
          ) : null}
          <Button
            type="submit"
            fullWidth={false}
            status={isSaving ? "loading" : "idle"}
            loadingText="Saving..."
            text="Save Creation"
          />
        </div>
      </form>
    </section>
  );
};

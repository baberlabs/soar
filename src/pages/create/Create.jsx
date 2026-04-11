import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { useSOARState } from "../../hooks/useSOARState";

export function Create() {
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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

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

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files?.length) {
      setFileName(files[0].name);
      setError("");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("bg-brand/10", "border-brand");
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove("bg-brand/10", "border-brand");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove("bg-brand/10", "border-brand");

    const files = event.dataTransfer.files;
    if (files?.length) {
      setFileName(files[0].name);
      setError("");
    }
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
          note: note.trim(),
          date: new Date().toLocaleDateString(),
          subjectId: selectedSubjectId || null,
        },
      });

      setTitle("");
      setNote("");
      setFileName("");
      setIsUploading(false);
      setStep("gallery");
    }, 700);
  };

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
                        <div className="flex h-32 items-center justify-center bg-brand/8">
                          <div className="text-center">
                            <p className="font-ui text-xs tracking-[0.12em] text-brand/65">
                              FILE
                            </p>
                            <p className="mt-1 font-body text-sm text-brand/80">
                              {creation.media}
                            </p>
                          </div>
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
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    />
                  </div>
                </label>

                {fileName ? (
                  <div className="mt-4 rounded-2xl bg-brand/8 p-3">
                    <p className="font-body text-sm text-navy">{fileName}</p>
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
    </main>
  );
}

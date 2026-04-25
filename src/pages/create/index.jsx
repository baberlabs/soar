import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/Button";
import { useSOARDispatch, useSOARState } from "../../store";

import { CreationCard } from "./components/CreationCard";
import { CreationForm } from "./components/CreationForm";
import { MediaViewerModal } from "./components/MediaViewerModal";
import { NetworkFeed } from "./components/NetworkFeed";

export default function Create() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedSubject = searchParams.get("subject");
  const [isComposerOpen, setIsComposerOpen] = useState(
    Boolean(requestedSubject),
  );
  const [viewer, setViewer] = useState(null);

  const enrolledSubjects = useMemo(
    () =>
      state.curriculum
        .map((entry) =>
          state.subjects.find((subject) => subject.id === entry.subjectId),
        )
        .filter(Boolean),
    [state.curriculum, state.subjects],
  );

  const creations = useMemo(
    () => (state.creations ?? []).slice().reverse(),
    [state.creations],
  );

  const handleSaveCreation = (payload) => {
    dispatch({ type: "ADD_CREATION", payload });

    // Close the composer + clear the deep-link param so refreshing
    // doesn't reopen the form.
    setIsComposerOpen(false);
    if (searchParams.has("subject")) {
      const next = new URLSearchParams(searchParams);
      next.delete("subject");
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-3">
          <p className="font-ui text-sm tracking-[0.16em] text-brand/55">
            Create
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Make the work visible.
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Save a draft, an image, a recording, or a note that shows what
            changed because you spent time with a subject. Browse what your
            network is making while you&rsquo;re here.
          </p>
        </header>

        {/* Section 1 — Your Creations */}
        <section className="space-y-5">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
                Your gallery
              </p>
              <h2 className="mt-1 font-ui text-3xl text-brand">
                Your creations
              </h2>
            </div>
            <Button
              type="button"
              fullWidth={false}
              onClick={() => setIsComposerOpen((open) => !open)}
            >
              <Plus size={16} strokeWidth={2} />
              {isComposerOpen ? "Close composer" : "New creation"}
            </Button>
          </header>

          {isComposerOpen ? (
            <CreationForm
              enrolledSubjects={enrolledSubjects}
              requestedSubjectId={requestedSubject}
              onSubmit={handleSaveCreation}
              onCancel={() => setIsComposerOpen(false)}
            />
          ) : null}

          {creations.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-brand/24 bg-page p-12 text-center">
              <p className="mx-auto max-w-xl font-body text-base leading-relaxed text-brand/76">
                Nothing shared yet. Your subject paths get stronger when they
                leave behind drafts, images, or notes you can point to later.
              </p>
              {!isComposerOpen ? (
                <Button
                  className="mx-auto mt-5 sm:w-auto"
                  fullWidth={false}
                  onClick={() => setIsComposerOpen(true)}
                >
                  Share your first creation
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {creations.map((creation) => {
                const subject = state.subjects.find(
                  (entry) => entry.id === creation.subjectId,
                );
                return (
                  <CreationCard
                    key={creation.id}
                    creation={creation}
                    subject={subject}
                    onExpand={setViewer}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Section 2 — Your Network */}
        <NetworkFeed />
      </div>

      <MediaViewerModal creation={viewer} onClose={() => setViewer(null)} />
    </main>
  );
}

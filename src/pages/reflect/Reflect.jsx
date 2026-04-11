import { useState } from "react";
import { useSOARState } from "../../hooks/useSOARState";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";

export function Reflect() {
  const [state, dispatch] = useSOARState();
  const [tab, setTab] = useState("vision");

  const [visionTitle, setVisionTitle] = useState("");
  const [visionPrompt, setVisionPrompt] = useState("");

  const [letterTitle, setLetterTitle] = useState("");
  const [letterBody, setLetterBody] = useState("");
  const [openDate, setOpenDate] = useState("");

  if (!state.user) {
    return null;
  }

  const saveVision = (e) => {
    e.preventDefault();
    if (!visionTitle.trim()) return;

    dispatch({
      type: "ADD_VISION_BOARD",
      payload: {
        id: `vb_${Date.now()}`,
        title: visionTitle,
        prompt: visionPrompt,
        createdAt: new Date().toISOString(),
      },
    });

    setVisionTitle("");
    setVisionPrompt("");
  };

  const saveLetter = (e) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterBody.trim()) return;

    dispatch({
      type: "ADD_LETTER",
      payload: {
        id: `lt_${Date.now()}`,
        title: letterTitle,
        body: letterBody,
        openDate: openDate || null,
        createdAt: new Date().toISOString(),
      },
    });

    setLetterTitle("");
    setLetterBody("");
    setOpenDate("");
  };

  const visionBoards = state.reflections?.visionBoards ?? [];
  const letters = state.reflections?.letters ?? [];

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Reflect
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Keep your long-term intentions clear. Capture a vision board for
            where you are heading and write letters to your future self.
          </p>
        </header>

        <div className="flex gap-2 border-b border-brand/20">
          <button
            type="button"
            onClick={() => setTab("vision")}
            className={`px-4 py-3 font-ui text-sm tracking-[0.08em] ${tab === "vision" ? "border-b-2 border-brand text-brand" : "text-brand/60 hover:text-brand"}`}
          >
            Vision Boards ({visionBoards.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("letters")}
            className={`px-4 py-3 font-ui text-sm tracking-[0.08em] ${tab === "letters" ? "border-b-2 border-brand text-brand" : "text-brand/60 hover:text-brand"}`}
          >
            Future Letters ({letters.length})
          </button>
        </div>

        {tab === "vision" ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <form
              onSubmit={saveVision}
              className="space-y-5 rounded-2xl border border-brand/20 bg-cream/80 p-6"
            >
              <h2 className="font-ui text-2xl text-brand">New Vision Board</h2>
              <InputField
                label="Title"
                type="text"
                name="vision-title"
                placeholder="2027 Growth Vision"
                value={visionTitle}
                onValueChange={setVisionTitle}
              />
              <div className="space-y-2">
                <label
                  htmlFor="vision-prompt"
                  className="font-body text-navy/60"
                >
                  Focus prompt
                </label>
                <textarea
                  id="vision-prompt"
                  value={visionPrompt}
                  onChange={(e) => setVisionPrompt(e.target.value)}
                  placeholder="What do you want your life, craft, and relationships to look like?"
                  rows="5"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <Button type="submit" text="Save Vision Board" />
            </form>

            <section className="space-y-4">
              {visionBoards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand/30 bg-page p-8 text-center font-body text-brand/70">
                  No vision boards yet.
                </div>
              ) : (
                visionBoards
                  .slice()
                  .reverse()
                  .map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-brand/20 bg-cream p-5"
                    >
                      <h3 className="font-ui text-xl text-brand">
                        {item.title}
                      </h3>
                      {item.prompt ? (
                        <p className="mt-2 font-body text-sm text-brand/80">
                          {item.prompt}
                        </p>
                      ) : null}
                      <p className="mt-3 font-body text-xs text-brand/60">
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </article>
                  ))
              )}
            </section>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <form
              onSubmit={saveLetter}
              className="space-y-5 rounded-2xl border border-brand/20 bg-cream/80 p-6"
            >
              <h2 className="font-ui text-2xl text-brand">
                Letter To Future Self
              </h2>
              <InputField
                label="Letter title"
                type="text"
                name="letter-title"
                placeholder="For me, one year from now"
                value={letterTitle}
                onValueChange={setLetterTitle}
              />
              <div className="space-y-2">
                <label htmlFor="open-date" className="font-body text-navy/60">
                  Open date (optional)
                </label>
                <input
                  id="open-date"
                  type="date"
                  value={openDate}
                  onChange={(e) => setOpenDate(e.target.value)}
                  className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="letter-body" className="font-body text-navy/60">
                  Message
                </label>
                <textarea
                  id="letter-body"
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                  placeholder="What do you want to remember when things feel hard?"
                  rows="6"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <Button type="submit" text="Save Letter" />
            </form>

            <section className="space-y-4">
              {letters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand/30 bg-page p-8 text-center font-body text-brand/70">
                  No letters yet.
                </div>
              ) : (
                letters
                  .slice()
                  .reverse()
                  .map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-brand/20 bg-cream p-5"
                    >
                      <h3 className="font-ui text-xl text-brand">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 font-body text-sm text-brand/80">
                        {item.body}
                      </p>
                      <p className="mt-3 font-body text-xs text-brand/60">
                        {item.openDate
                          ? `Open on ${item.openDate}`
                          : "No open date"}
                      </p>
                    </article>
                  ))
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

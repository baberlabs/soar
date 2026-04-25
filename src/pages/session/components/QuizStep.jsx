import { useState } from "react";
import { Button } from "../../../components/Button";

export const QuizStep = ({ quiz, onContinue }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hardestNote, setHardestNote] = useState("");

  const isCorrect = selected === quiz.correctIndex;

  const checkAnswer = () => {
    if (selected === null) return;
    setShowResult(true);
  };

  const retry = () => {
    setShowResult(false);
    setSelected(null);
  };

  return (
    <section className="space-y-6 rounded-4xl border border-brand/12 bg-page p-6 md:p-8">
      <header className="space-y-1">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
          Step 3 of 5
        </p>
        <h2 className="font-ui text-3xl text-brand">Quiz</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-brand/76">
          {quiz.question}
        </p>
      </header>

      <div className="grid gap-3">
        {quiz.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const showAsCorrect = showResult && optionIndex === quiz.correctIndex;
          const showAsWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={`${option}-${optionIndex}`}
              type="button"
              onClick={() => {
                if (showResult) setShowResult(false);
                setSelected(optionIndex);
              }}
              disabled={showResult && isCorrect}
              className={`rounded-2xl border px-4 py-3 text-left font-body text-sm transition ${
                showAsCorrect
                  ? "border-sage/40 bg-sage/10 text-brand"
                  : showAsWrong
                    ? "border-rose-300 bg-rose-50 text-brand"
                    : isSelected
                      ? "border-brand bg-brand/8 text-brand"
                      : "border-brand/12 bg-cream text-brand/75 hover:border-brand/24"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div
          className={`rounded-2xl border p-4 ${
            isCorrect
              ? "border-sage/30 bg-sage/10"
              : "border-yellow/35 bg-yellow/15"
          }`}
        >
          <p className="font-ui text-sm text-brand">
            {isCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1 font-body text-sm leading-relaxed text-brand/74">
            {quiz.explanation}
          </p>

          {!isCorrect ? (
            <div className="mt-4">
              <label
                htmlFor="quiz-hardest-note"
                className="block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
              >
                What felt hardest?
                <span className="ml-1 text-brand/45">(optional)</span>
              </label>
              <textarea
                id="quiz-hardest-note"
                value={hardestNote}
                onChange={(event) => setHardestNote(event.target.value)}
                placeholder="A quick note can sharpen the next attempt..."
                className="mt-2 min-h-20 w-full rounded-2xl border border-brand/16 bg-cream px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-brand/10 pt-5">
        {!showResult ? (
          <Button
            type="button"
            fullWidth={false}
            text="Check Answer"
            onClick={checkAnswer}
            disabled={selected === null}
          />
        ) : isCorrect ? (
          <Button
            type="button"
            fullWidth={false}
            text="Continue to reflection"
            onClick={onContinue}
          />
        ) : (
          <Button
            type="button"
            variant="secondary"
            fullWidth={false}
            text="Try Again"
            onClick={retry}
          />
        )}
      </div>
    </section>
  );
};

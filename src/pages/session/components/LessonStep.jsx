import { Button } from "../../../components/Button";

export const LessonStep = ({ media, lessonContent, keyFacts, onContinue }) => (
  <section className="space-y-6 rounded-4xl border border-brand/12 bg-cream/75 p-6 md:p-8">
    <StepHeader number={1} of={5} title="Session content" />

    <figure className="overflow-hidden rounded-3xl border border-brand/12 bg-page">
      <img
        src={media.hero.src}
        alt={media.hero.alt}
        className="h-56 w-full object-cover md:h-72"
        loading="lazy"
      />
      <figcaption className="px-4 py-3 font-body text-xs text-brand/64">
        {media.hero.caption}
      </figcaption>
    </figure>

    <div className="space-y-4">
      {lessonContent.paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="font-body text-sm leading-relaxed text-brand/78"
        >
          {paragraph}
        </p>
      ))}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {media.supporting.map((image) => (
        <figure
          key={image.caption}
          className="overflow-hidden rounded-3xl border border-brand/12"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
          <figcaption className="px-4 py-3 font-body text-xs text-brand/64">
            {image.caption}
          </figcaption>
        </figure>
      ))}
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {keyFacts.map((fact) => (
        <article
          key={fact.title}
          className="rounded-3xl border border-brand/12 bg-page p-4"
        >
          <p className="font-ui text-sm tracking-[0.08em] text-brand">
            {fact.title}
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/74">
            {fact.body}
          </p>
        </article>
      ))}
    </div>

    <div className="rounded-3xl border border-brand/10 bg-page p-5">
      <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
        Practice flow
      </p>
      <ol className="mt-3 space-y-3">
        {lessonContent.practiceSteps.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 font-body text-sm leading-relaxed text-brand/78"
          >
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 font-ui text-xs text-brand">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>

    <div className="flex flex-wrap gap-3 border-t border-brand/10 pt-5">
      <Button
        type="button"
        fullWidth={false}
        text="Mark as Read"
        onClick={onContinue}
      />
    </div>
  </section>
);

const StepHeader = ({ number, of, title }) => (
  <header className="space-y-1">
    <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
      Step {number} of {of}
    </p>
    <h2 className="font-ui text-3xl text-brand">{title}</h2>
  </header>
);

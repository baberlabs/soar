import { Link } from "react-router-dom";
import { Maximize2 } from "lucide-react";
import {
  getMediaLabel,
  hasRenderableMedia,
  isExpandableMedia,
  renderCreationMedia,
} from "../utils/media.jsx";

export const CreationCard = ({ creation, subject, onExpand }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-brand/12 bg-cream transition hover:border-brand/30 hover:shadow-[0_18px_36px_rgba(75,81,149,0.08)]">
    <div className="relative bg-brand/8">
      {renderCreationMedia(creation, { className: "h-44 w-full" })}
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
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onExpand?.(creation);
          }}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-navy/55 text-cream backdrop-blur-sm transition hover:bg-navy/70"
          aria-label="Expand media"
          title="Expand media"
        >
          <Maximize2 size={14} strokeWidth={1.75} />
        </button>
      ) : null}
    </div>

    <Link
      to={`/create/${creation.id}`}
      className="flex flex-1 flex-col gap-2 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-ui text-lg leading-snug text-brand">
          {creation.title}
        </h3>
        <span className="shrink-0 rounded-full bg-brand/8 px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-brand/72">
          {getMediaLabel(creation.mediaKind)}
        </span>
      </div>

      {creation.note ? (
        <p className="line-clamp-3 font-body text-sm leading-relaxed text-brand/72">
          {creation.note}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 font-body text-xs text-brand/55">
        {subject ? <span>{subject.name}</span> : null}
        {subject && creation.date ? <span aria-hidden="true">·</span> : null}
        {creation.date ? <span>{creation.date}</span> : null}
      </div>
    </Link>
  </article>
);

import { Avatar } from "../../connect/components/shared/Avatar";
import { formatRelative } from "../utils/media";

export const NetworkCreationCard = ({ peer, creation }) => (
  <article className="flex h-full flex-col gap-3 rounded-[1.75rem] border border-brand/12 bg-cream p-5 transition hover:border-brand/30 hover:shadow-[0_18px_36px_rgba(75,81,149,0.08)]">
    <header className="flex items-center gap-3">
      <Avatar avatar={peer.avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-ui text-sm text-brand">{peer.name}</p>
        <p className="truncate font-body text-xs text-brand/55">
          {peer.city}
          {creation.publishedAt
            ? ` · ${formatRelative(creation.publishedAt)}`
            : ""}
        </p>
      </div>
      {creation.format ? (
        <span className="shrink-0 rounded-full bg-brand/8 px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-brand/72">
          {creation.format}
        </span>
      ) : null}
    </header>

    <div className="flex flex-1 flex-col gap-2">
      <h3 className="font-ui text-lg leading-snug text-brand">
        {creation.title}
      </h3>
      {creation.summary ? (
        <p className="line-clamp-3 font-body text-sm leading-relaxed text-brand/72">
          {creation.summary}
        </p>
      ) : null}
    </div>
  </article>
);

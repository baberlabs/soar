import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  Database,
  HardDrive,
  Images,
  Network,
  PenLine,
  Server,
  Sparkles,
  Vote,
} from "lucide-react";

import { ProgressBar } from "../../components/ProgressBar";
import { getButtonClasses } from "../../components/buttonStyles";
import { useSOARState } from "../../store";
import {
  deriveNodeStats,
  formatBytes,
  formatUptime,
} from "../account/utils/nodeStats";
import {
  PHASES,
  computeEffectivePhase,
  getPhaseLabel,
} from "../forum/utils/phase";
import { LETTER_STATUS } from "../reflect/constants";
import {
  formatMonthLabel,
  getCurrentMonthValue,
  isMonthUnlocked,
} from "../reflect/utils/month";
import { getBoardMonthValue } from "../reflect/utils/moodboard";

export default function Dashboard() {
  const state = useSOARState();

  const model = useMemo(() => buildDashboardModel(state), [state]);

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="relative mx-auto w-full max-w-360 overflow-hidden px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-136 bg-[linear-gradient(180deg,rgba(180,220,245,0.24),rgba(251,247,236,0))]"
      />

      <div className="mx-auto max-w-6xl space-y-5 md:space-y-6">
        <DashboardTopbar model={model} />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)]">
          <FocusPanel focus={model.focus} />
          <PulsePanel model={model} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <LearningLane learning={model.learning} />
          <ReflectionLoop reflection={model.reflection} />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <CommunityPanel community={model.community} />
          <CreationsPanel creations={model.creations} />
          <NodePanel node={model.node} />
        </section>
      </div>
    </main>
  );
}

const DashboardTopbar = ({ model }) => (
  <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
    <div className="max-w-3xl space-y-3">
      <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
        {model.todayLabel}
      </p>
      <h1 className="font-display text-[clamp(3.3rem,8vw,6rem)] leading-[0.9] text-brand">
        {model.greeting}, {model.firstName}.
      </h1>
      <p className="max-w-2xl font-body text-base leading-relaxed text-brand/76 md:text-lg">
        Choose one useful move, keep your learning loop alive, and leave with
        something finished or clearer than when you arrived.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-2 rounded-[1.2rem] border border-brand/10 bg-cream/80 p-2 shadow-[0_14px_34px_rgba(75,81,149,0.045)]">
      <MiniStat
        label="Learn"
        value={`${model.learning.completionPercent}%`}
        detail={
          model.learning.totalSessions
            ? `${model.learning.completedSessions}/${model.learning.totalSessions}`
            : "new"
        }
      />
      <MiniStat
        label="Reflect"
        value={model.reflection.score}
        detail={model.reflection.currentMonthLabel}
      />
      <MiniStat
        label="Peers"
        value={String(model.community.acceptedConnections)}
        detail="linked"
      />
    </div>
  </header>
);

const FocusPanel = ({ focus }) => {
  const PrimaryIcon = focus.primary.icon;

  return (
    <section className="grid gap-5 rounded-3xl bg-brand p-5 text-cream shadow-[0_24px_60px_rgba(75,81,149,0.14)] md:p-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(18rem,0.72fr)]">
      <div className="flex min-h-88 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-cream/62">
              Start here
            </p>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-accent">
              <PrimaryIcon size={20} strokeWidth={1.8} />
            </span>
          </div>
          <h2 className="mt-8 max-w-2xl font-ui text-[clamp(2.35rem,5vw,4.6rem)] leading-[0.9] text-cream">
            {focus.primary.title}
          </h2>
          <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-cream/74 md:text-base">
            {focus.primary.body}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to={focus.primary.href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cream px-5 py-3 font-ui text-sm tracking-[0.06em] text-brand transition hover:bg-accent"
          >
            {focus.primary.cta}
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <p className="font-body text-xs text-cream/58">
            {focus.primary.meta}
          </p>
        </div>
      </div>

      <ol className="grid content-start gap-2">
        {focus.queue.map((item, index) => (
          <FocusStep
            key={item.id}
            item={item}
            index={index}
            isPrimary={item.id === focus.primary.id}
          />
        ))}
      </ol>
    </section>
  );
};

const FocusStep = ({ item, index, isPrimary }) => {
  const Icon = item.icon;

  return (
    <li>
      <Link
        to={item.href}
        className={`group flex items-start gap-3 rounded-[1.05rem] border p-3.5 transition ${
          isPrimary
            ? "border-accent/50 bg-cream/12"
            : "border-cream/12 bg-cream/6 hover:border-cream/22 hover:bg-cream/10"
        }`}
      >
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-body text-xs font-semibold ${
            isPrimary ? "bg-accent text-brand" : "bg-cream/10 text-cream/72"
          }`}
        >
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <Icon
              size={14}
              strokeWidth={1.8}
              className={isPrimary ? "text-accent" : "text-cream/52"}
            />
            <span className="font-ui text-base leading-none text-cream">
              {item.label}
            </span>
          </span>
          <span className="mt-1 block font-body text-xs leading-relaxed text-cream/62">
            {item.detail}
          </span>
        </span>
        <ArrowRight
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
          className="mt-1 shrink-0 text-cream/42 transition group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </Link>
    </li>
  );
};

const PulsePanel = ({ model }) => (
  <aside className="grid gap-5">
    <section className="rounded-3xl border border-brand/12 bg-cream/88 p-5 shadow-[0_18px_44px_rgba(75,81,149,0.055)] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/52">
            Pulse
          </p>
          <h2 className="mt-1 font-ui text-3xl leading-none text-brand">
            Your loop
          </h2>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky/28 text-brand">
          <Circle size={18} strokeWidth={1.8} />
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <LoopMetric
          label="Learning"
          value={`${model.learning.completedSessions}/${model.learning.totalSessions || 0}`}
          detail={
            model.learning.primary
              ? model.learning.primary.subject.name
              : "No subject yet"
          }
        />
        <LoopMetric
          label="Reflection"
          value={model.reflection.score}
          detail={model.reflection.summary}
        />
        <LoopMetric
          label="Community"
          value={String(model.community.activeProposals.length)}
          detail={
            model.community.votingProposals.length
              ? `${model.community.votingProposals.length} vote open`
              : "discussion queue"
          }
        />
      </div>
    </section>

    <nav
      aria-label="Dashboard shortcuts"
      className="grid grid-cols-2 gap-2 rounded-[1.3rem] border border-brand/10 bg-page/64 p-2"
    >
      {model.shortcuts.map((shortcut) => (
        <ShortcutLink key={shortcut.label} shortcut={shortcut} />
      ))}
    </nav>
  </aside>
);

const LearningLane = ({ learning }) => (
  <section className="rounded-3xl border border-brand/12 bg-cream/88 p-5 shadow-[0_18px_44px_rgba(75,81,149,0.055)] md:p-6">
    <PanelHeader
      eyebrow="Learning lane"
      title={learning.primary ? learning.primary.subject.name : "Choose a path"}
      actionLabel="Open Learn"
      actionTo="/learn"
    />

    {learning.primary ? (
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_9.5rem]">
        <div className="min-w-0">
          <p className="font-body text-sm leading-relaxed text-brand/72">
            {learning.primary.nextLesson
              ? `Next session: ${learning.primary.nextLesson.title}.`
              : learning.primary.isComplete
                ? "This path is complete. Review your work or pick a new lane."
                : learning.primary.subject.description}
          </p>

          <div className="mt-5">
            <ProgressBar
              value={learning.primary.progress}
              label="Subject progress"
              size="md"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to={learning.primary.href}
              className={getButtonClasses({
                variant: "primary",
                size: "sm",
                fullWidth: false,
                className: "gap-1.5",
              })}
            >
              {learning.primary.nextLesson ? "Resume session" : "Review path"}
              <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <p className="font-body text-xs text-brand/62">
              {learning.primary.completedSessions} of{" "}
              {learning.primary.totalSessions} session
              {learning.primary.totalSessions === 1 ? "" : "s"} complete
            </p>
          </div>

          {learning.secondary.length > 0 ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {learning.secondary.map((item) => (
                <LearningChip key={item.subject.id} item={item} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-between rounded-[1.1rem] bg-brand p-4 text-cream">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.12em] text-cream/58">
              Remaining
            </p>
            <p className="mt-2 font-display text-5xl leading-none text-accent">
              {learning.primary.remainingSessions}
            </p>
          </div>
          <p className="mt-6 font-body text-xs leading-relaxed text-cream/66">
            session{learning.primary.remainingSessions === 1 ? "" : "s"} before
            this path closes
          </p>
        </div>
      </div>
    ) : (
      <EmptyPanel
        icon={BookOpenCheck}
        title="Start with one subject."
        body="A focused curriculum gives the dashboard something real to orient around."
        href="/learn"
        cta="Browse subjects"
      />
    )}
  </section>
);

const ReflectionLoop = ({ reflection }) => (
  <section className="rounded-3xl border border-brand/12 bg-cream/88 p-5 shadow-[0_18px_44px_rgba(75,81,149,0.055)] md:p-6">
    <PanelHeader
      eyebrow="Reflection loop"
      title={reflection.currentMonthLabel}
      actionLabel="Open Vision Board"
      actionTo="/vision-board"
    />

    <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <VisionPreview reflection={reflection} />
      <LetterStatus reflection={reflection} />
    </div>
  </section>
);

const CommunityPanel = ({ community }) => (
  <section className="rounded-[1.35rem] border border-brand/12 bg-cream/88 p-5 shadow-[0_16px_38px_rgba(75,81,149,0.05)]">
    <PanelHeader
      eyebrow="Community"
      title="Forum pulse"
      actionLabel="Open Forum"
      actionTo="/forum/all"
      compact
    />

    <div className="mt-4">
      {community.activeProposals.length > 0 ? (
        <ul className="space-y-2">
          {community.activeProposals.slice(0, 3).map((proposal) => (
            <ProposalRow key={proposal.id} proposal={proposal} />
          ))}
        </ul>
      ) : (
        <CompactEmpty
          icon={Vote}
          body="No active proposals. The floor is clear when you have an idea worth shaping."
        />
      )}
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-brand/10 pt-4">
      <MiniStat
        label="Voting"
        value={String(community.votingProposals.length)}
        detail="open"
      />
      <MiniStat
        label="Peers"
        value={String(community.acceptedConnections)}
        detail="connected"
      />
    </div>
  </section>
);

const CreationsPanel = ({ creations }) => (
  <section className="rounded-[1.35rem] border border-brand/12 bg-cream/88 p-5 shadow-[0_16px_38px_rgba(75,81,149,0.05)]">
    <PanelHeader
      eyebrow="Create"
      title="Recent work"
      actionLabel="Open Create"
      actionTo="/create"
      compact
    />

    <div className="mt-4">
      {creations.recent.length > 0 ? (
        <ul className="space-y-2">
          {creations.recent.map((creation, index) => (
            <CreationRow
              key={`${creation.id ?? creation.createdAt ?? creation.title}-${index}`}
              creation={creation}
            />
          ))}
        </ul>
      ) : (
        <CompactEmpty
          icon={Sparkles}
          body="Nothing published yet. Turn a session note into your first saved creation."
        />
      )}
    </div>

    <Link
      to="/create"
      className="mt-4 inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/78"
    >
      {creations.recent.length ? "Make another thing" : "Start creating"}
      <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  </section>
);

const NodePanel = ({ node }) => (
  <section className="rounded-[1.35rem] border border-brand/12 bg-[linear-gradient(160deg,rgba(118,164,91,0.1),rgba(251,247,236,0.9)_48%)] p-5 shadow-[0_16px_38px_rgba(75,81,149,0.05)]">
    <PanelHeader
      eyebrow="Node"
      title="Owned data"
      actionLabel="Manage"
      actionTo="/account/node"
      compact
    />

    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sage/18 bg-sage/8 p-3.5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-cream text-sage">
        <Server size={18} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="font-ui text-xl leading-none text-brand">Online</p>
        <p className="mt-1 font-body text-xs leading-relaxed text-brand/66">
          {node.stats.pinCount} pinned item
          {node.stats.pinCount === 1 ? "" : "s"} ·{" "}
          {formatBytes(node.stats.totalBytes)}
        </p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2">
      <NodeMetric
        icon={Network}
        label="Peers"
        value={String(node.stats.connectedPeers)}
      />
      <NodeMetric
        icon={HardDrive}
        label="Storage"
        value={formatBytes(node.stats.totalBytes)}
      />
      <NodeMetric
        icon={Database}
        label="Pins"
        value={String(node.stats.pinCount)}
      />
      <NodeMetric
        icon={Server}
        label="Uptime"
        value={formatUptime(node.stats.uptimeSince)}
      />
    </div>
  </section>
);

const VisionPreview = ({ reflection }) => {
  if (!reflection.currentBoard) {
    return (
      <Link
        to="/vision-board"
        className="flex min-h-56 flex-col justify-between rounded-[1.15rem] border border-dashed border-brand/22 bg-page/72 p-4 transition hover:border-brand/36"
      >
        <Images size={22} strokeWidth={1.6} className="text-brand/44" />
        <div>
          <p className="font-ui text-2xl leading-none text-brand">
            Board not started
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/68">
            Give {reflection.currentMonthLabel} a visual direction.
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/vision-board"
      className="group block rounded-[1.15rem] border border-brand/10 bg-page/72 p-3 transition hover:border-brand/28"
    >
      {reflection.imageItems.length > 0 ? (
        <div className="grid min-h-48 grid-cols-3 grid-rows-2 gap-2">
          {reflection.imageItems.map((item, index) => (
            <div
              key={item.id}
              className={`overflow-hidden rounded-[0.9rem] border border-brand/10 bg-cream ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={item.imageData}
                alt={item.caption || "Vision board item"}
                className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 flex-col justify-end rounded-[0.95rem] border border-brand/10 bg-cream/70 p-4">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/50">
            {reflection.boardItemCount} item
            {reflection.boardItemCount === 1 ? "" : "s"}
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/68">
            Add images when the direction needs more texture.
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-ui text-xl leading-none text-brand">Vision board</p>
        <span className="font-body text-xs text-brand/58">
          {reflection.boardItemCount} item
          {reflection.boardItemCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
};

const LetterStatus = ({ reflection }) => {
  const Icon = reflection.letterView.icon;

  return (
    <div className="flex min-h-56 flex-col justify-between rounded-[1.15rem] border border-brand/10 bg-page/72 p-4">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/50">
            Monthly letter
          </p>
          <span
            className={`inline-flex rounded-full px-3 py-1 font-body text-xs ${reflection.letterView.tone}`}
          >
            {reflection.letterView.status}
          </span>
        </div>
        <div className="mt-5 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-brand/8 text-brand">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <div>
            <h3 className="font-ui text-2xl leading-none text-brand">
              {reflection.letterView.title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-brand/68">
              {reflection.letterView.body}
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/monthly-letter"
        className="mt-5 inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/78"
      >
        {reflection.letterView.cta}
        <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </div>
  );
};

const LearningChip = ({ item }) => (
  <Link
    to={item.href}
    className="group rounded-[0.95rem] border border-brand/10 bg-page/68 p-3 transition hover:border-brand/24 hover:bg-page"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="line-clamp-1 font-ui text-base leading-none text-brand">
          {item.subject.name}
        </p>
        <p className="mt-1 font-body text-xs text-brand/58">
          {item.completedSessions}/{item.totalSessions} sessions
        </p>
      </div>
      <ArrowRight
        size={14}
        strokeWidth={1.8}
        className="shrink-0 text-brand/38 transition group-hover:translate-x-0.5 group-hover:text-brand"
      />
    </div>
    <div className="mt-3">
      <ProgressBar
        value={item.progress}
        size="sm"
        label={null}
        showPercent={false}
      />
    </div>
  </Link>
);

const ProposalRow = ({ proposal }) => {
  const phase = computeEffectivePhase(proposal);

  return (
    <li>
      <Link
        to={`/forum/${proposal.id}`}
        className="group flex items-start justify-between gap-3 rounded-[0.95rem] border border-brand/10 bg-page/70 p-3 transition hover:border-brand/24 hover:bg-page"
      >
        <div className="min-w-0">
          <p className="line-clamp-2 font-ui text-sm leading-snug text-brand">
            {proposal.title}
          </p>
          {proposal.votingDeadline ? (
            <p className="mt-1 font-body text-xs text-brand/58">
              Vote before {formatShortDate(proposal.votingDeadline)}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] ${getPhaseTone(
            phase,
          )}`}
        >
          {getPhaseLabel(phase)}
        </span>
      </Link>
    </li>
  );
};

const CreationRow = ({ creation }) => (
  <li className="flex items-start gap-3 rounded-[0.95rem] border border-brand/10 bg-page/70 p-3">
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.8rem] bg-yellow/30 text-brand">
      <Sparkles size={14} strokeWidth={1.75} />
    </span>
    <div className="min-w-0">
      <p className="line-clamp-1 font-ui text-sm leading-none text-brand">
        {creation.title || "Untitled creation"}
      </p>
      <p className="mt-1 font-body text-xs text-brand/58">
        {creation.type || "Creation"}
        {formatRelative(
          creation.publishedAt ?? creation.createdAt ?? creation.date,
        )
          ? ` · ${formatRelative(
              creation.publishedAt ?? creation.createdAt ?? creation.date,
            )}`
          : ""}
      </p>
    </div>
  </li>
);

const PanelHeader = ({
  eyebrow,
  title,
  actionLabel,
  actionTo,
  compact = false,
}) => (
  <header className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/52">
        {eyebrow}
      </p>
      <h2
        className={`mt-1 font-ui leading-none text-brand ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        {title}
      </h2>
    </div>
    <Link
      to={actionTo}
      className="inline-flex shrink-0 items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/78"
    >
      {actionLabel}
      <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  </header>
);

const MiniStat = ({ label, value, detail }) => (
  <div className="rounded-[0.95rem] bg-page/74 px-3 py-2.5">
    <p className="font-body text-[0.66rem] uppercase tracking-[0.12em] text-brand/46">
      {label}
    </p>
    <p className="mt-1 font-display text-2xl leading-none text-brand">
      {value}
    </p>
    <p className="mt-1 truncate font-body text-xs text-brand/58">{detail}</p>
  </div>
);

const LoopMetric = ({ label, value, detail }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand/10 bg-page/70 p-3.5">
    <div className="min-w-0">
      <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/46">
        {label}
      </p>
      <p className="mt-1 truncate font-body text-sm text-brand/68">{detail}</p>
    </div>
    <p className="shrink-0 font-display text-3xl leading-none text-brand">
      {value}
    </p>
  </div>
);

const ShortcutLink = ({ shortcut }) => {
  const Icon = shortcut.icon;

  return (
    <Link
      to={shortcut.href}
      className="group flex items-center gap-2 rounded-[0.95rem] border border-brand/8 bg-cream/78 p-3 transition hover:border-brand/20 hover:bg-cream"
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.8rem] bg-brand/7 text-brand">
        <Icon size={15} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block font-ui text-sm leading-none text-brand">
          {shortcut.label}
        </span>
        <span className="mt-1 block truncate font-body text-xs text-brand/54">
          {shortcut.detail}
        </span>
      </span>
    </Link>
  );
};

const EmptyPanel = ({ icon, title, body, href, cta }) => {
  const Icon = icon;

  return (
    <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-[1.15rem] border border-dashed border-brand/22 bg-page/70 p-6 text-center">
      <Icon size={24} strokeWidth={1.7} className="text-brand/42" />
      <h3 className="mt-4 font-ui text-2xl leading-none text-brand">{title}</h3>
      <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-brand/66">
        {body}
      </p>
      <Link
        to={href}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 font-ui text-sm tracking-[0.05em] text-cream transition hover:bg-brand/90"
      >
        {cta}
        <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </div>
  );
};

const CompactEmpty = ({ icon, body }) => {
  const Icon = icon;

  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand/22 bg-page/70 p-5 text-center">
      <Icon size={20} strokeWidth={1.6} className="text-brand/42" />
      <p className="font-body text-sm leading-relaxed text-brand/66">{body}</p>
    </div>
  );
};

const NodeMetric = ({ icon, label, value }) => {
  const Icon = icon;

  return (
    <div className="rounded-[0.95rem] border border-brand/9 bg-page/68 p-3">
      <div className="flex items-center gap-2 text-brand/52">
        <Icon size={14} strokeWidth={1.8} />
        <p className="font-body text-[0.66rem] uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>
      <p className="mt-2 font-ui text-lg leading-none text-brand">{value}</p>
    </div>
  );
};

const buildDashboardModel = (state) => {
  const firstName = deriveFirstName(state.user);
  const learning = deriveLearning(state);
  const reflection = deriveReflection(state);
  const community = deriveCommunity(state);
  const creations = deriveCreations(state);
  const node = {
    stats: deriveNodeStats({
      user: state.user,
      creations: state.creations,
      reflections: state.reflections,
      connections: state.connections,
    }),
  };
  const focus = buildFocus({ learning, reflection, community, creations });

  return {
    firstName,
    greeting: getTimeBasedGreeting(),
    todayLabel: getTodayLabel(),
    learning,
    reflection,
    community,
    creations,
    node,
    focus,
    shortcuts: [
      {
        label: "Learn",
        detail: learning.primary
          ? learning.primary.subject.name
          : "Pick a path",
        href: learning.primary?.href ?? "/learn",
        icon: BookOpenCheck,
      },
      {
        label: "Reflect",
        detail: reflection.summary,
        href: reflection.primaryHref,
        icon: Images,
      },
      {
        label: "Forum",
        detail: community.votingProposals.length ? "Vote open" : "Discussion",
        href: community.votingProposals.length ? "/forum/voting" : "/forum/all",
        icon: Vote,
      },
      {
        label: "Create",
        detail: creations.count ? `${creations.count} saved` : "First piece",
        href: "/create",
        icon: Sparkles,
      },
    ],
  };
};

const buildFocus = ({ learning, reflection, community, creations }) => {
  const learningAction = learning.primary
    ? {
        id: "learning",
        label: "Learn",
        title: learning.primary.isComplete
          ? `Review ${learning.primary.subject.name}`
          : `Continue ${learning.primary.subject.name}`,
        body: learning.primary.nextLesson
          ? `Next up: ${learning.primary.nextLesson.title}. A short session is the clearest way back into momentum.`
          : "Review the path you completed and decide whether this lane is closed or ready for another pass.",
        detail: learning.primary.nextLesson
          ? learning.primary.nextLesson.title
          : "Path review",
        href: learning.primary.href,
        cta: learning.primary.nextLesson ? "Resume session" : "Review path",
        meta: `${learning.primary.remainingSessions} session${
          learning.primary.remainingSessions === 1 ? "" : "s"
        } left`,
        icon: BookOpenCheck,
        weight: learning.primary.isComplete ? 40 : 100,
      }
    : {
        id: "learning",
        label: "Learn",
        title: "Choose your first path",
        body: "The rest of SOAR works better when there is one subject you are actively returning to.",
        detail: "No active subject",
        href: "/learn",
        cta: "Browse subjects",
        meta: "Start the loop",
        icon: BookOpenCheck,
        weight: 110,
      };

  const reflectionAction = {
    id: "reflection",
    label: "Reflect",
    title: reflection.focusTitle,
    body: reflection.focusBody,
    detail: reflection.summary,
    href: reflection.primaryHref,
    cta: reflection.focusCta,
    meta: reflection.currentMonthLabel,
    icon: reflection.focusIcon,
    weight: reflection.needsAttention ? 90 : 35,
  };

  const communityAction = {
    id: "community",
    label: "Forum",
    title: community.votingProposals.length
      ? "Cast your open vote"
      : "Check the proposals",
    body: community.votingProposals.length
      ? `${community.votingProposals.length} proposal${
          community.votingProposals.length === 1 ? " is" : "s are"
        } in voting. Add your voice before the window closes.`
      : community.activeProposals.length
        ? "There are live proposals in discussion. Read, respond, or move an idea forward."
        : "No proposals need attention right now.",
    detail: community.votingProposals.length
      ? `${community.votingProposals.length} vote open`
      : `${community.activeProposals.length} active`,
    href: community.votingProposals.length ? "/forum/voting" : "/forum/all",
    cta: community.votingProposals.length ? "Review votes" : "Open Forum",
    meta: "One peer, one vote",
    icon: Vote,
    weight: community.votingProposals.length ? 80 : 25,
  };

  const creationAction = {
    id: "creation",
    label: "Create",
    title: creations.count ? "Make the next thing" : "Publish your first thing",
    body: creations.count
      ? "Turn today’s learning or reflection into something saved on your node."
      : "A small finished thing beats a perfect idea waiting around.",
    detail: creations.count ? `${creations.count} saved` : "Nothing saved yet",
    href: "/create",
    cta: "Open Create",
    meta: creations.latestLabel,
    icon: Sparkles,
    weight: creations.count ? 20 : 50,
  };

  const queue = [
    learningAction,
    reflectionAction,
    communityAction,
    creationAction,
  ].sort((a, b) => b.weight - a.weight);

  return {
    primary: queue[0],
    queue,
  };
};

const deriveLearning = (state) => {
  const subjectsById = new Map(
    (state.subjects ?? []).map((subject) => [subject.id, subject]),
  );

  const items = (state.curriculum ?? [])
    .map((enrollment) => {
      const subject = subjectsById.get(enrollment.subjectId);
      if (!subject) return null;

      const lessons = subject.lessons ?? [];
      const totalSessions = lessons.length;
      const completedSessions = enrollment.completedLessonIds?.length ?? 0;
      const computedProgress = totalSessions
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;
      const progress = Math.max(
        Number.isFinite(enrollment.progress) ? enrollment.progress : 0,
        computedProgress,
      );
      const nextLesson = lessons[completedSessions] ?? null;
      const href = nextLesson
        ? `/learn/${subject.id}/sessions/${nextLesson.id}`
        : `/learn/${subject.id}`;
      const activityTime = new Date(
        enrollment.lastActivityAt ?? enrollment.enrolledAt ?? 0,
      ).getTime();

      return {
        enrollment,
        subject,
        href,
        progress,
        nextLesson,
        completedSessions,
        totalSessions,
        remainingSessions: Math.max(totalSessions - completedSessions, 0),
        isComplete: totalSessions > 0 && completedSessions >= totalSessions,
        activityTime: Number.isNaN(activityTime) ? 0 : activityTime,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.isComplete !== b.isComplete) return a.isComplete ? 1 : -1;
      return b.activityTime - a.activityTime;
    });

  const completedSessions = items.reduce(
    (sum, item) => sum + item.completedSessions,
    0,
  );
  const totalSessions = items.reduce(
    (sum, item) => sum + item.totalSessions,
    0,
  );

  return {
    items,
    primary: items[0] ?? null,
    secondary: items.slice(1, 5),
    completedSessions,
    totalSessions,
    completionPercent: totalSessions
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0,
  };
};

const deriveReflection = (state) => {
  const currentMonthValue = getCurrentMonthValue();
  const currentMonthLabel = formatMonthLabel(currentMonthValue);
  const currentBoard =
    (state.reflections?.visionBoards ?? []).find(
      (board) => getBoardMonthValue(board) === currentMonthValue,
    ) ?? null;
  const imageItems = (currentBoard?.items ?? [])
    .filter((item) => item.imageData)
    .slice(0, 4);
  const activeLetter = getActiveLetter(state.reflections?.letters);
  const letterView = getLetterView(activeLetter, currentMonthLabel);
  const hasBoard = Boolean(currentBoard);
  const hasLetter = Boolean(activeLetter);
  const needsAttention = !hasBoard || letterView.needsAttention;
  const score =
    hasBoard && hasLetter && !letterView.needsAttention
      ? "2/2"
      : `${Number(hasBoard) + Number(hasLetter && !letterView.needsAttention)}/2`;

  const focusTitle = !hasBoard
    ? `Start ${currentMonthLabel}`
    : letterView.needsAttention
      ? letterView.title
      : "Reflection loop closed";

  const focusBody = !hasBoard
    ? "Build a board for the month before the month decides for you."
    : letterView.needsAttention
      ? letterView.body
      : "Your board and letter are both in motion. Keep them close while you learn and make.";

  return {
    currentMonthValue,
    currentMonthLabel,
    currentBoard,
    boardItemCount: currentBoard?.items?.length ?? 0,
    imageItems,
    activeLetter,
    letterView,
    needsAttention,
    score,
    summary: !hasBoard
      ? "Board needed"
      : letterView.needsAttention
        ? letterView.status
        : "Loop closed",
    primaryHref: !hasBoard ? "/vision-board" : letterView.href,
    focusTitle,
    focusBody,
    focusCta: !hasBoard ? "Start board" : letterView.cta,
    focusIcon: !hasBoard ? Images : letterView.icon,
  };
};

const deriveCommunity = (state) => {
  const activeProposals = (state.forum ?? [])
    .filter((proposal) => {
      const phase = computeEffectivePhase(proposal);
      return phase === PHASES.DISCUSSION || phase === PHASES.VOTING;
    })
    .sort((a, b) => {
      const phaseA = computeEffectivePhase(a);
      const phaseB = computeEffectivePhase(b);
      if (phaseA === PHASES.VOTING && phaseB !== PHASES.VOTING) return -1;
      if (phaseB === PHASES.VOTING && phaseA !== PHASES.VOTING) return 1;
      if (phaseA === PHASES.VOTING && phaseB === PHASES.VOTING) {
        return (
          new Date(a.votingDeadline ?? 0).getTime() -
          new Date(b.votingDeadline ?? 0).getTime()
        );
      }
      return (
        new Date(b.publishedAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.publishedAt ?? a.createdAt ?? 0).getTime()
      );
    });

  return {
    activeProposals,
    votingProposals: activeProposals.filter(
      (proposal) => computeEffectivePhase(proposal) === PHASES.VOTING,
    ),
    acceptedConnections: (state.connections ?? []).filter(
      (connection) => connection.status === "accepted",
    ).length,
    pendingConnections: (state.connections ?? []).filter(
      (connection) => connection.status === "pending",
    ).length,
  };
};

const deriveCreations = (state) => {
  const sorted = [...(state.creations ?? [])].sort((a, b) => {
    const dateA = new Date(
      a.publishedAt ?? a.createdAt ?? a.date ?? 0,
    ).getTime();
    const dateB = new Date(
      b.publishedAt ?? b.createdAt ?? b.date ?? 0,
    ).getTime();
    return dateB - dateA;
  });
  const latest = sorted[0] ?? null;

  return {
    all: sorted,
    recent: sorted.slice(0, 3),
    count: sorted.length,
    latest,
    latestLabel: latest
      ? `Latest ${formatRelative(latest.publishedAt ?? latest.createdAt ?? latest.date)}`
      : "No creations yet",
  };
};

const getLetterView = (letter, currentMonthLabel) => {
  if (!letter) {
    return {
      title: "Write your letter",
      status: "Not written",
      body: `Capture a note to your future self for ${currentMonthLabel}.`,
      cta: "Write letter",
      href: "/monthly-letter",
      icon: PenLine,
      tone: "bg-brand/8 text-brand/72",
      needsAttention: true,
    };
  }

  const targetLabel = letter.targetMonth
    ? formatMonthLabel(letter.targetMonth)
    : "next month";

  if (letter.status === LETTER_STATUS.DRAFT) {
    return {
      title: `Finish ${targetLabel}`,
      status: "Draft",
      body: "The letter is started. Seal it when the intention feels clear enough to keep.",
      cta: "Finish letter",
      href: "/monthly-letter",
      icon: PenLine,
      tone: "bg-yellow/35 text-brand",
      needsAttention: true,
    };
  }

  if (letter.status === LETTER_STATUS.SEALED) {
    if (isMonthUnlocked(letter.targetMonth)) {
      return {
        title: "Read your letter",
        status: "Ready",
        body: "The seal has opened. Read it and decide what carries forward.",
        cta: "Read letter",
        href: "/monthly-letter",
        icon: PenLine,
        tone: "bg-sage/16 text-sage",
        needsAttention: true,
      };
    }

    return {
      title: `Sealed for ${targetLabel}`,
      status: "Sealed",
      body: "Your future note is waiting. Keep the promise unless you choose to break the seal.",
      cta: "View letter",
      href: "/monthly-letter",
      icon: CheckCircle2,
      tone: "bg-brand/8 text-brand/72",
      needsAttention: false,
    };
  }

  if (letter.status === LETTER_STATUS.UNLOCKED) {
    return {
      title: "Reflect before archive",
      status: letter.sealBroken ? "Opened early" : "Opened",
      body: "Add the reflection so this cycle can close cleanly.",
      cta: "Reflect",
      href: "/monthly-letter",
      icon: PenLine,
      tone: "bg-sage/16 text-sage",
      needsAttention: true,
    };
  }

  if (letter.status === LETTER_STATUS.REVIEWED) {
    return {
      title: "Archive the cycle",
      status: "Reviewed",
      body: "Reflection is complete. Archive it when you are ready for the next letter.",
      cta: "Open archive",
      href: "/monthly-letter",
      icon: CheckCircle2,
      tone: "bg-sage/16 text-sage",
      needsAttention: true,
    };
  }

  return {
    title: "Open your letter",
    status: "Needs check",
    body: "Open the monthly letter space to see what needs attention.",
    cta: "Open letter",
    href: "/monthly-letter",
    icon: PenLine,
    tone: "bg-brand/8 text-brand/72",
    needsAttention: true,
  };
};

const getPhaseTone = (phase) =>
  phase === PHASES.VOTING
    ? "bg-yellow/35 text-brand"
    : phase === PHASES.DISCUSSION
      ? "bg-sky/28 text-brand"
      : "bg-brand/8 text-brand/72";

const getActiveLetter = (letters = []) => {
  const candidates = letters.filter(
    (letter) => letter.status !== LETTER_STATUS.ARCHIVED,
  );
  if (candidates.length === 0) return null;

  return [...candidates].sort((a, b) =>
    String(b.targetMonth || "").localeCompare(String(a.targetMonth || "")),
  )[0];
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getTodayLabel = () =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

const deriveFirstName = (user) => {
  if (!user) return "peer";
  if (user.firstName) return user.firstName;
  if (user.fullName) return String(user.fullName).trim().split(" ")[0];
  if (user.name) return String(user.name).trim().split(" ")[0];
  return "peer";
};

const formatShortDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};

const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatShortDate(iso);
};

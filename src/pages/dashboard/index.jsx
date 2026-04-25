import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  HardDrive,
  Images,
  PenLine,
  Server,
  Sparkles,
  Vote,
} from "lucide-react";

import { ProgressBar } from "../../components/ProgressBar";
import { getButtonClasses } from "../../components/buttonStyles";
import { useSOARState } from "../../store";
import { formatBytes } from "../../utils/format";
import { deriveNodeStats } from "../account/utils/nodeStats";
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

      <div className="mx-auto max-w-6xl space-y-8">
        <DashboardHero model={model} />

        <section aria-labelledby="start-here-title" className="space-y-3">
          <PrimaryActionCard action={model.focus.primary} />
          <SecondaryActions actions={model.focus.secondary} />
        </section>

        <StateSummary summary={model.summary} />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <LearningPanel learning={model.learning} />
          <MonthlyCyclePanel cycle={model.monthlyCycle} />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <CreatePanel creations={model.creations} />
          <ForumPanel community={model.community} />
        </section>

        <DataOwnershipPanel dataOwnership={model.dataOwnership} />

        <p className="mx-auto max-w-2xl text-center font-body text-sm leading-relaxed text-brand/55">
          No infinite feed. Choose a destination, complete the action, and close
          the loop.
        </p>
      </div>
    </main>
  );
}

const DashboardHero = ({ model }) => (
  <header className="max-w-3xl space-y-3">
    <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
      {model.todayLabel}
    </p>
    <h1 className="font-display text-[clamp(3.3rem,8vw,6rem)] leading-[0.9] text-brand">
      {model.greeting}, {model.firstName}.
    </h1>
    <p className="max-w-2xl font-body text-base leading-relaxed text-brand/76 md:text-lg">
      Choose one useful move. Leave with something learned, created, decided, or
      clearer.
    </p>
  </header>
);

const PrimaryActionCard = ({ action }) => {
  const Icon = action.icon;

  return (
    <section
      aria-labelledby="start-here-title"
      className="rounded-4xl bg-brand p-6 text-cream shadow-[0_24px_60px_rgba(75,81,149,0.14)] md:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-cream/62">
              Start here
            </p>
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/10 text-accent">
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>
          </div>

          <h2
            id="start-here-title"
            className="mt-8 max-w-3xl font-ui text-[clamp(2.35rem,5vw,4.6rem)] leading-[0.9] text-cream"
          >
            {action.title}
          </h2>

          {action.detail ? (
            <p className="mt-3 font-body text-sm leading-relaxed text-accent md:text-base">
              {action.detail}
            </p>
          ) : null}

          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-cream/74 md:text-base">
            {action.body}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-56 lg:items-end">
          <Link
            to={action.href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cream px-5 py-3 font-ui text-sm tracking-[0.06em] text-brand transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            {action.cta}
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </Link>

          <p className="font-body text-xs leading-relaxed text-cream/58 lg:text-right">
            {action.meta}
          </p>

          {action.priorityReason ? (
            <p className="rounded-2xl border border-cream/12 bg-cream/8 px-3 py-2 font-body text-xs leading-relaxed text-cream/64 lg:text-right">
              {action.priorityReason}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

const SecondaryActions = ({ actions }) => {
  if (!actions.length) return null;

  return (
    <div>
      <h2 className="sr-only">Other useful moves</h2>
      <div className="grid gap-2 md:grid-cols-3">
        {actions.slice(0, 3).map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              to={action.href}
              className="group flex items-center justify-between gap-3 rounded-[1.15rem] border border-brand/10 bg-cream/78 p-3.5 transition hover:border-brand/22 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.9rem] bg-brand/7 text-brand">
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-ui text-sm leading-none text-brand">
                    {action.label}
                  </span>
                  <span className="mt-1 block truncate font-body text-xs text-brand/58">
                    {action.detail}
                  </span>
                </span>
              </span>
              <ArrowRight
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
                className="shrink-0 text-brand/38 transition group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const StateSummary = ({ summary }) => (
  <section aria-labelledby="state-summary-title" className="space-y-3">
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/52">
          At a glance
        </p>
        <h2 id="state-summary-title" className="font-ui text-2xl text-brand">
          Today&apos;s state
        </h2>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => (
        <SummaryCard key={item.label} item={item} />
      ))}
    </div>
  </section>
);

const SummaryCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <article className="rounded-[1.25rem] border border-brand/10 bg-cream/82 p-4 shadow-[0_12px_30px_rgba(75,81,149,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-[0.66rem] uppercase tracking-[0.12em] text-brand/46">
            {item.label}
          </p>
          <p className="mt-2 font-display text-4xl leading-none text-brand">
            {item.value}
          </p>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/7 text-brand/70">
          <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 truncate font-body text-xs text-brand/58">
        {item.detail}
      </p>
    </article>
  );
};

const LearningPanel = ({ learning }) => (
  <section className="rounded-3xl border border-brand/12 bg-cream/88 p-5 shadow-[0_18px_44px_rgba(75,81,149,0.055)] md:p-6">
    <PanelHeader
      eyebrow="Learning"
      title={learning.primary ? learning.primary.subject.name : "Choose a path"}
      actionLabel="Open Learn"
      actionTo="/learn"
    />

    {learning.primary ? (
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_9.5rem]">
        <div className="min-w-0">
          <div className="rounded-[1.15rem] border border-brand/10 bg-page/70 p-4">
            <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/50">
              Next session
            </p>
            <h3 className="mt-2 font-ui text-2xl leading-none text-brand">
              {learning.primary.nextLesson?.title ??
                (learning.primary.isComplete ? "Path complete" : "Review path")}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-brand/70">
              {learning.primary.nextLesson
                ? "A short session is enough to keep the path alive."
                : learning.primary.isComplete
                  ? "You completed this path. Review it or choose a new subject."
                  : learning.primary.subject.description}
            </p>
          </div>

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

          {learning.secondaryCount > 0 ? (
            <p className="mt-4 font-body text-xs text-brand/58">
              Also active: {learning.secondaryCount} path
              {learning.secondaryCount === 1 ? "" : "s"}. Open Learn to switch
              lanes.
            </p>
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

const MonthlyCyclePanel = ({ cycle }) => (
  <section className="rounded-3xl border border-brand/12 bg-cream/88 p-5 shadow-[0_18px_44px_rgba(75,81,149,0.055)] md:p-6">
    <PanelHeader
      eyebrow="Monthly cycle"
      title={cycle.currentMonthLabel}
      actionLabel="Open board"
      actionTo="/vision-board"
    />

    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <CycleStatusCard
        icon={Images}
        label="Vision board"
        status={cycle.board.status}
        title={cycle.board.title}
        body={cycle.board.body}
        href="/vision-board"
        cta={cycle.board.cta}
        tone={cycle.board.tone}
      />
      <CycleStatusCard
        icon={cycle.letter.icon}
        label="Monthly letter"
        status={cycle.letter.status}
        title={cycle.letter.title}
        body={cycle.letter.body}
        href="/monthly-letter"
        cta={cycle.letter.cta}
        tone={cycle.letter.tone}
      />
    </div>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-brand/10 bg-page/70 p-4">
      <div>
        <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/50">
          Cycle state
        </p>
        <p className="mt-1 font-ui text-xl leading-none text-brand">
          {cycle.score} complete
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/vision-board"
          className="rounded-full border border-brand/15 px-4 py-2 font-ui text-sm text-brand transition hover:border-brand/30 hover:bg-brand/5"
        >
          Open board
        </Link>
        <Link
          to="/monthly-letter"
          className="rounded-full bg-brand px-4 py-2 font-ui text-sm text-cream transition hover:bg-brand/90"
        >
          Open letter
        </Link>
      </div>
    </div>
  </section>
);

const CycleStatusCard = ({
  icon: Icon,
  label,
  status,
  title,
  body,
  href,
  cta,
  tone,
}) => (
  <article className="flex min-h-56 flex-col justify-between rounded-[1.15rem] border border-brand/10 bg-page/72 p-4">
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/50">
          {label}
        </p>
        <span className={`rounded-full px-3 py-1 font-body text-xs ${tone}`}>
          {status}
        </span>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-brand/8 text-brand">
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-ui text-2xl leading-none text-brand">{title}</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/68">
            {body}
          </p>
        </div>
      </div>
    </div>

    <Link
      to={href}
      className="mt-5 inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/78"
    >
      {cta}
      <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  </article>
);

const CreatePanel = ({ creations }) => (
  <section className="rounded-[1.35rem] border border-brand/12 bg-cream/88 p-5 shadow-[0_16px_38px_rgba(75,81,149,0.05)] md:p-6">
    <PanelHeader
      eyebrow="Create"
      title="Saved output"
      actionLabel="Open Create"
      actionTo="/create"
      compact
    />

    <div className="mt-5 rounded-[1.15rem] border border-brand/10 bg-page/72 p-4">
      {creations.latest ? (
        <>
          <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/50">
            Latest piece
          </p>
          <h3 className="mt-2 line-clamp-2 font-ui text-2xl leading-none text-brand">
            {creations.latest.title || "Untitled creation"}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/66">
            {creations.latest.type || "Creation"}
            {creations.latestDateLabel ? ` · ${creations.latestDateLabel}` : ""}
          </p>
        </>
      ) : (
        <CompactEmpty
          icon={Sparkles}
          body="Nothing saved yet. Turn a session note, idea, or reflection into your first piece."
        />
      )}
    </div>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
      <p className="font-body text-sm text-brand/68">
        <span className="font-ui text-xl text-brand">{creations.count}</span>{" "}
        saved piece{creations.count === 1 ? "" : "s"}
      </p>
      <Link
        to="/create"
        className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 font-ui text-sm text-cream transition hover:bg-brand/90"
      >
        {creations.count ? "Open Create" : "Create first piece"}
        <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </div>
  </section>
);

const ForumPanel = ({ community }) => (
  <section className="rounded-[1.35rem] border border-brand/12 bg-cream/88 p-5 shadow-[0_16px_38px_rgba(75,81,149,0.05)] md:p-6">
    <PanelHeader
      eyebrow="Forum"
      title={
        community.votingProposals.length ? "Votes open" : "Governance pulse"
      }
      actionLabel="Open Forum"
      actionTo="/forum/all"
      compact
    />

    <div className="mt-5">
      {community.votingProposals.length > 0 ? (
        <ul className="space-y-2">
          {community.votingProposals.slice(0, 2).map((proposal) => (
            <ProposalRow key={proposal.id} proposal={proposal} />
          ))}
        </ul>
      ) : community.activeProposals.length > 0 ? (
        <div className="rounded-[1.15rem] border border-brand/10 bg-page/72 p-4">
          <p className="font-ui text-2xl leading-none text-brand">
            {community.activeProposals.length} active proposal
            {community.activeProposals.length === 1 ? "" : "s"}
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/66">
            Read, respond, or move an idea forward when it needs shaping.
          </p>
        </div>
      ) : (
        <CompactEmpty
          icon={Vote}
          body="No active proposals. The floor is clear when you have an idea worth shaping."
        />
      )}
    </div>

    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-brand/10 pt-4">
      <MiniStat
        label="Voting"
        value={String(community.votingProposals.length)}
        detail="open"
      />
      <MiniStat
        label="Discussion"
        value={String(community.discussionProposals.length)}
        detail="active"
      />
    </div>

    <p className="mt-4 font-body text-xs leading-relaxed text-brand/58">
      One peer, one vote.
    </p>
  </section>
);

const DataOwnershipPanel = ({ dataOwnership }) => (
  <section className="rounded-3xl border border-brand/12 bg-[linear-gradient(160deg,rgba(118,164,91,0.11),rgba(251,247,236,0.92)_48%)] p-5 shadow-[0_16px_38px_rgba(75,81,149,0.05)] md:p-6">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="max-w-3xl">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/52">
          Data ownership
        </p>
        <h2 className="mt-1 font-ui text-3xl leading-none text-brand">
          Stored on this device
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-brand/72 md:text-base">
          Everything SOAR knows about you is stored securely on this device
          using your browser&apos;s local database.
        </p>
      </div>

      <Link
        to="/account/data"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-ui text-sm tracking-[0.05em] text-cream transition hover:bg-brand/90"
      >
        Manage data
        <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <DataMetric
        icon={Database}
        label="Saved items"
        value={String(dataOwnership.itemCount)}
      />
      <DataMetric
        icon={HardDrive}
        label="Device storage"
        value={dataOwnership.formattedBytes}
      />
      <DataMetric icon={Server} label="Status" value={dataOwnership.status} />
    </div>
  </section>
);

const DataMetric = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-sage/18 bg-cream/72 p-4">
    <div className="flex items-center gap-2 text-brand/52">
      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
      <p className="font-body text-[0.66rem] uppercase tracking-[0.12em]">
        {label}
      </p>
    </div>
    <p className="mt-2 font-ui text-xl leading-none text-brand">{value}</p>
  </div>
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

const buildDashboardModel = (state) => {
  const firstName = deriveFirstName(state.user);
  const learning = deriveLearning(state);
  const monthlyCycle = deriveMonthlyCycle(state);
  const community = deriveCommunity(state);
  const creations = deriveCreations(state);
  const dataOwnership = deriveDataOwnership(state);
  const focus = buildFocus({ learning, monthlyCycle, community, creations });

  return {
    firstName,
    greeting: getTimeBasedGreeting(),
    todayLabel: getTodayLabel(),
    learning,
    monthlyCycle,
    community,
    creations,
    dataOwnership,
    focus,
    summary: [
      {
        label: "Learning",
        value: learning.totalSessions
          ? `${learning.completionPercent}%`
          : "New",
        detail: learning.totalSessions
          ? `${learning.completedSessions}/${learning.totalSessions} sessions`
          : "Choose path",
        icon: BookOpenCheck,
      },
      {
        label: "Monthly",
        value: monthlyCycle.score,
        detail: monthlyCycle.summary,
        icon: Images,
      },
      {
        label: "Create",
        value: String(creations.count),
        detail: creations.count === 1 ? "saved piece" : "saved pieces",
        icon: Sparkles,
      },
      {
        label: "Forum",
        value: community.votingProposals.length
          ? String(community.votingProposals.length)
          : "Clear",
        detail: community.votingProposals.length
          ? "votes open"
          : "no votes open",
        icon: Vote,
      },
    ],
  };
};

const buildFocus = ({ learning, monthlyCycle, community, creations }) => {
  const learningAction = learning.primary
    ? {
        id: "learning",
        label: "Learn",
        title: learning.primary.isComplete
          ? `Review ${learning.primary.subject.name}`
          : `Continue ${learning.primary.subject.name}`,
        body: learning.primary.nextLesson
          ? "A short session is the clearest way back into momentum."
          : "Review the path you completed and decide whether this lane is closed or ready for another pass.",
        detail: learning.primary.nextLesson
          ? `Next up: ${learning.primary.nextLesson.title}`
          : "Path review",
        href: learning.primary.href,
        cta: learning.primary.nextLesson ? "Resume session" : "Review path",
        meta: `${learning.primary.remainingSessions} session${
          learning.primary.remainingSessions === 1 ? "" : "s"
        } left`,
        priorityReason: "Learning is the clearest active path back into SOAR.",
        icon: BookOpenCheck,
        weight: learning.primary.isComplete ? 50 : 100,
      }
    : {
        id: "learning",
        label: "Learn",
        title: "Choose your first path",
        body: "SOAR works best when there is one subject you are actively returning to.",
        detail: "No active subject",
        href: "/learn",
        cta: "Browse subjects",
        meta: "Start the loop",
        priorityReason: "A focused curriculum gives the dashboard direction.",
        icon: BookOpenCheck,
        weight: 110,
      };

  const monthlyAction = {
    id: "monthly-cycle",
    label: "Monthly cycle",
    title: monthlyCycle.focusTitle,
    body: monthlyCycle.focusBody,
    detail: monthlyCycle.summary,
    href: monthlyCycle.primaryHref,
    cta: monthlyCycle.focusCta,
    meta: monthlyCycle.currentMonthLabel,
    priorityReason: monthlyCycle.needsAttention
      ? "Your monthly direction needs attention."
      : "Your monthly cycle is stable.",
    icon: monthlyCycle.focusIcon,
    weight: monthlyCycle.focusWeight,
  };

  const communityAction = {
    id: "forum",
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
    priorityReason: community.votingProposals.length
      ? "Open votes are time-sensitive governance work."
      : "Governance is clear right now.",
    icon: Vote,
    weight: community.urgentVotingProposals.length
      ? 95
      : community.votingProposals.length
        ? 75
        : 30,
  };

  const creationAction = {
    id: "create",
    label: "Create",
    title: creations.count ? "Make the next thing" : "Create your first piece",
    body: creations.count
      ? "Turn today’s learning or monthly direction into something saved."
      : "A small finished thing beats a perfect idea waiting around.",
    detail: creations.count ? `${creations.count} saved` : "Nothing saved yet",
    href: "/create",
    cta: creations.count ? "Open Create" : "Create first piece",
    meta: creations.latestDateLabel || "Build output",
    priorityReason: creations.count
      ? "Creation keeps SOAR output-led."
      : "SOAR should leave you with something made.",
    icon: Sparkles,
    weight: creations.count ? 40 : 70,
  };

  const queue = [
    learningAction,
    monthlyAction,
    communityAction,
    creationAction,
  ].sort((a, b) => b.weight - a.weight);

  return {
    primary: queue[0],
    secondary: queue.slice(1),
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
    secondaryCount: Math.max(items.length - 1, 0),
    completedSessions,
    totalSessions,
    completionPercent: totalSessions
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0,
  };
};

const deriveMonthlyCycle = (state) => {
  const currentMonthValue = getCurrentMonthValue();
  const currentMonthLabel = formatMonthLabel(currentMonthValue);
  const currentBoard =
    (state.reflections?.visionBoards ?? []).find(
      (board) => getBoardMonthValue(board) === currentMonthValue,
    ) ?? null;

  const activeLetter = getActiveLetter(state.reflections?.letters);
  const boardItemCount = currentBoard?.items?.length ?? 0;
  const boardComplete = boardItemCount >= 5;
  const hasBoard = Boolean(currentBoard);
  const letter = getLetterView(activeLetter, currentMonthLabel);

  const board = {
    status: !hasBoard ? "Not started" : boardComplete ? "Built" : "Started",
    title: !hasBoard
      ? "Board not started"
      : boardComplete
        ? "Board built"
        : "Board started",
    body: !hasBoard
      ? `Give ${currentMonthLabel} a visible direction before the month fills itself.`
      : `${boardItemCount} item${
          boardItemCount === 1 ? "" : "s"
        } shape this month’s direction.`,
    cta: !hasBoard ? "Start board" : "Open board",
    tone: !hasBoard ? "bg-yellow/35 text-brand" : "bg-sage/16 text-sage",
  };

  const completedParts = Number(hasBoard) + Number(!letter.needsAttention);
  const needsAttention = !hasBoard || letter.needsAttention;

  const focusTitle = !hasBoard
    ? `Start ${currentMonthLabel}`
    : letter.needsAttention
      ? letter.title
      : "Monthly cycle complete";

  const focusBody = !hasBoard
    ? "Create a vision board before the month becomes reactive."
    : letter.needsAttention
      ? letter.body
      : "Your board and letter are both in motion. Keep them close while you learn and make.";

  return {
    currentMonthValue,
    currentMonthLabel,
    currentBoard,
    activeLetter,
    board,
    letter,
    score: `${completedParts}/2`,
    summary: !hasBoard
      ? "Board needed"
      : letter.needsAttention
        ? letter.status
        : "Cycle complete",
    needsAttention,
    primaryHref: !hasBoard ? "/vision-board" : letter.href,
    focusTitle,
    focusBody,
    focusCta: !hasBoard ? "Start board" : letter.cta,
    focusIcon: !hasBoard ? Images : letter.icon,
    focusWeight: !hasBoard
      ? 90
      : letter.isReady
        ? 105
        : letter.needsAttention
          ? 85
          : 35,
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

  const votingProposals = activeProposals.filter(
    (proposal) => computeEffectivePhase(proposal) === PHASES.VOTING,
  );

  const discussionProposals = activeProposals.filter(
    (proposal) => computeEffectivePhase(proposal) === PHASES.DISCUSSION,
  );

  const urgentVotingProposals = votingProposals.filter((proposal) =>
    isWithinHours(proposal.votingDeadline, 48),
  );

  return {
    activeProposals,
    votingProposals,
    discussionProposals,
    urgentVotingProposals,
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
    count: sorted.length,
    latest,
    latestDateLabel: latest
      ? formatRelative(latest.publishedAt ?? latest.createdAt ?? latest.date)
      : "",
  };
};

const deriveDataOwnership = (state) => {
  const stats = deriveNodeStats({
    user: state.user,
    creations: state.creations,
    reflections: state.reflections,
    connections: state.connections,
  });

  return {
    stats,
    itemCount: stats.pinCount,
    formattedBytes: formatBytes(stats.totalBytes),
    status: "Ready",
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
      tone: "bg-yellow/35 text-brand",
      needsAttention: true,
      isReady: false,
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
      isReady: false,
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
        isReady: true,
      };
    }

    return {
      title: `Sealed for ${targetLabel}`,
      status: "Sealed",
      body: "Your future note is waiting until it unlocks.",
      cta: "View letter",
      href: "/monthly-letter",
      icon: CheckCircle2,
      tone: "bg-brand/8 text-brand/72",
      needsAttention: false,
      isReady: false,
    };
  }

  if (letter.status === LETTER_STATUS.UNLOCKED) {
    return {
      title: "Reflect before archive",
      status: letter.sealBroken ? "Opened early" : "Opened",
      body: "Add the reflection so this cycle can close cleanly.",
      cta: "Reflect on letter",
      href: "/monthly-letter",
      icon: PenLine,
      tone: "bg-sage/16 text-sage",
      needsAttention: true,
      isReady: true,
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
      isReady: false,
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
    isReady: false,
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

const isWithinHours = (iso, hours) => {
  if (!iso) return false;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const diffMs = date.getTime() - Date.now();
  return diffMs > 0 && diffMs <= hours * 60 * 60 * 1000;
};

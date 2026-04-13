import { useState } from "react";
import { useSOARState } from "../../hooks/useSOARState";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";

export default function Forum() {
  const [state, dispatch] = useSOARState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!state.user) {
    return null;
  }

  const proposals = state.forum ?? [];

  const submitProposal = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    dispatch({
      type: "ADD_PROPOSAL",
      payload: {
        id: `pr_${Date.now()}`,
        title,
        description,
        authorId: state.user.id,
        authorName: state.user.fullName,
        status: "open",
        votes: {},
        createdAt: new Date().toISOString(),
      },
    });

    setTitle("");
    setDescription("");
  };

  const castVote = (proposalId, voteValue) => {
    dispatch({
      type: "VOTE_ON_PROPOSAL",
      payload: {
        proposalId,
        userId: state.user.id,
        voteValue,
      },
    });
  };

  const closeProposal = (proposal) => {
    const yesVotes = Object.values(proposal.votes ?? {}).filter(Boolean).length;
    const noVotes = Object.values(proposal.votes ?? {}).filter(
      (v) => !v,
    ).length;
    const outcome = yesVotes >= noVotes ? "Approved" : "Rejected";

    dispatch({
      type: "CLOSE_PROPOSAL",
      payload: {
        id: proposal.id,
        outcome,
      },
    });
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Community Forum
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Propose improvements, vote on decisions, and shape SOAR as a
            member-owned platform.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <form
            onSubmit={submitProposal}
            className="space-y-5 rounded-2xl border border-brand/20 bg-cream/80 p-6"
          >
            <h2 className="font-ui text-2xl text-brand">New Proposal</h2>
            <InputField
              label="Proposal title"
              type="text"
              name="proposal-title"
              placeholder="Add monthly accountability circles"
              value={title}
              onValueChange={setTitle}
            />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="proposal-description"
                className="font-body text-navy/60"
              >
                Description
              </label>
              <textarea
                id="proposal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6"
                placeholder="Describe what should change and why it benefits members."
                className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
              />
            </div>
            <Button type="submit" text="Submit Proposal" />
          </form>

          <section className="space-y-4">
            <h2 className="font-ui text-2xl text-brand">
              Active Proposals ({proposals.length})
            </h2>
            {proposals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand/30 bg-page p-8 text-center font-body text-brand/70">
                No proposals yet.
              </div>
            ) : (
              proposals
                .slice()
                .reverse()
                .map((proposal) => {
                  const yesVotes = Object.values(proposal.votes ?? {}).filter(
                    Boolean,
                  ).length;
                  const noVotes = Object.values(proposal.votes ?? {}).filter(
                    (v) => !v,
                  ).length;
                  const myVote = proposal.votes?.[state.user.id];

                  return (
                    <article
                      key={proposal.id}
                      className="space-y-4 rounded-2xl border border-brand/20 bg-cream p-5"
                    >
                      <div>
                        <h3 className="font-ui text-xl text-brand">
                          {proposal.title}
                        </h3>
                        <p className="mt-2 font-body text-sm text-brand/80">
                          {proposal.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 font-body text-xs text-brand/70">
                        <span>By {proposal.authorName}</span>
                        <span>•</span>
                        <span>
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="uppercase tracking-widest">
                          {proposal.status}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          disabled={proposal.status !== "open"}
                          onClick={() => castVote(proposal.id, true)}
                          className={`rounded-lg px-3 py-2 font-ui text-xs tracking-[0.08em] ${myVote === true ? "bg-sage text-cream" : "bg-page text-brand"} disabled:opacity-50`}
                        >
                          Yes ({yesVotes})
                        </button>
                        <button
                          type="button"
                          disabled={proposal.status !== "open"}
                          onClick={() => castVote(proposal.id, false)}
                          className={`rounded-lg px-3 py-2 font-ui text-xs tracking-[0.08em] ${myVote === false ? "bg-brand text-cream" : "bg-page text-brand"} disabled:opacity-50`}
                        >
                          No ({noVotes})
                        </button>
                      </div>

                      {proposal.status === "open" ? (
                        <Button
                          type="button"
                          text="Close Voting"
                          onClick={() => closeProposal(proposal)}
                        />
                      ) : (
                        <p className="font-body text-sm text-brand/80">
                          Outcome: {proposal.outcome}
                        </p>
                      )}
                    </article>
                  );
                })
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

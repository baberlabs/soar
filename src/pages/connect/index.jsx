import { useMemo, useState } from "react";
import { useSOARState } from "../../hooks/useSOARState";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";

function generateMembers(interests = []) {
  const base = [
    {
      id: "m1",
      name: "Ari Patel",
      bio: "Documentary photographer and editor",
      tags: ["Photography", "Film"],
    },
    {
      id: "m2",
      name: "Lena Brooks",
      bio: "Writes essays on ethics and technology",
      tags: ["Writing", "Philosophy"],
    },
    {
      id: "m3",
      name: "Marco Diaz",
      bio: "Frontend learner building community tools",
      tags: ["JavaScript", "Design"],
    },
    {
      id: "m4",
      name: "Nia Walker",
      bio: "Leads local mindfulness circles",
      tags: ["Meditation", "Leadership"],
    },
  ];

  if (!interests.length) return base;

  return base.sort((a, b) => {
    const scoreA = a.tags.filter((t) => interests.includes(t)).length;
    const scoreB = b.tags.filter((t) => interests.includes(t)).length;
    return scoreB - scoreA;
  });
}

export default function Connect() {
  const [state, dispatch] = useSOARState();
  const [messageDrafts, setMessageDrafts] = useState({});
  const currentUserId = state.user?.id;

  const members = useMemo(
    () => generateMembers(state.user?.interests ?? []),
    [state.user?.interests],
  );

  if (!state.user) {
    return null;
  }

  const sendConnectionRequest = (member) => {
    const existing = state.connections.find((c) =>
      c.members?.includes(member.id),
    );
    if (existing) return;

    dispatch({
      type: "ADD_CONNECTION",
      payload: {
        id: `cn_${member.id}_${state.connections.length + 1}`,
        members: [currentUserId, member.id],
        peer: member,
        status: "pending",
      },
    });
  };

  const sendMessage = (connection) => {
    const value = (messageDrafts[connection.id] ?? "").trim();
    if (!value) return;

    dispatch({
      type: "ADD_CONNECTION_MESSAGE",
      payload: {
        connectionId: connection.id,
        message: {
          body: value,
          fromUserId: state.user.id,
        },
      },
    });

    setMessageDrafts((prev) => ({ ...prev, [connection.id]: "" }));
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Connect
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Build meaningful connections with members who share your goals and
            interests.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <section className="space-y-4">
            <h2 className="font-ui text-2xl text-brand">Suggested Members</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {members.map((member) => {
                const connection = state.connections.find((c) =>
                  c.members?.includes(member.id),
                );
                return (
                  <article
                    key={member.id}
                    className="rounded-2xl border border-brand/20 bg-cream p-5"
                  >
                    <h3 className="font-ui text-xl text-brand">
                      {member.name}
                    </h3>
                    <p className="mt-2 font-body text-sm text-brand/80">
                      {member.bio}
                    </p>
                    <p className="mt-3 font-body text-xs text-brand/60">
                      {member.tags.join(" • ")}
                    </p>
                    {connection ? (
                      <p className="mt-4 font-body text-xs uppercase tracking-[0.12em] text-sage">
                        {connection.status}
                      </p>
                    ) : (
                      <div className="mt-4">
                        <Button
                          type="button"
                          text="Send Request"
                          onClick={() => sendConnectionRequest(member)}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-ui text-2xl text-brand">Your Connections</h2>
            {(state.connections ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand/30 bg-page p-6 text-center font-body text-brand/70">
                No connections yet.
              </div>
            ) : (
              (state.connections ?? []).map((connection) => {
                const peerId = (connection.members ?? []).find(
                  (memberId) => memberId !== currentUserId,
                );
                const peer =
                  connection.peer ??
                  members.find((member) => member.id === peerId);

                return (
                  <article
                    key={connection.id}
                    className="space-y-3 rounded-2xl border border-brand/20 bg-cream p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-ui text-lg text-brand">
                        {peer?.name ?? "Member"}
                      </h3>
                      <span className="font-body text-xs uppercase tracking-widest text-brand/70">
                        {connection.status}
                      </span>
                    </div>

                    <div className="max-h-28 space-y-2 overflow-y-auto rounded-xl bg-page p-3">
                      {(connection.messages ?? []).length === 0 ? (
                        <p className="font-body text-xs text-brand/60">
                          No messages yet.
                        </p>
                      ) : (
                        connection.messages.map((msg) => (
                          <p
                            key={msg.id}
                            className="font-body text-xs text-brand/80"
                          >
                            {msg.body}
                          </p>
                        ))
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="New message"
                        type="text"
                        name={`msg-${connection.id}`}
                        placeholder="Say hello"
                        value={messageDrafts[connection.id] ?? ""}
                        required={false}
                        onValueChange={(val) =>
                          setMessageDrafts((prev) => ({
                            ...prev,
                            [connection.id]: val,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        text="Send"
                        onClick={() => sendMessage(connection)}
                      />
                    </div>
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

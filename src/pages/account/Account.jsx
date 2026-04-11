import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSOARState } from "../../hooks/useSOARState";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";

export function Account() {
  const [state, dispatch] = useSOARState();
  const navigate = useNavigate();

  const user = state.user;
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [status, setStatus] = useState("idle");

  if (!user) {
    return null;
  }

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 500));

    dispatch({
      type: "UPDATE_USER",
      payload: {
        fullName: fullName.trim(),
        email: email.trim(),
      },
    });

    setStatus("success");
    setTimeout(() => setStatus("idle"), 1000);
  };

  const handleSignOut = () => {
    dispatch({ type: "SIGN_OUT" });
    navigate("/login", { replace: true });
  };

  const nodeStatus = user.onboardingComplete ? "active" : "setup";

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Account
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Manage your profile, view your node status, and control your session
            settings.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="space-y-5 rounded-2xl border border-brand/20 bg-cream/80 p-6">
            <h2 className="font-ui text-2xl text-brand">Profile</h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <InputField
                label="Full name"
                type="text"
                name="account-full-name"
                placeholder="Your full name"
                value={fullName}
                onValueChange={setFullName}
              />
              <InputField
                label="Email"
                type="email"
                name="account-email"
                placeholder="you@example.com"
                value={email}
                onValueChange={setEmail}
              />
              <Button
                type="submit"
                text="Save Profile"
                loadingText="Saving..."
                status={status}
                disabled={status === "loading"}
              />
            </form>
          </article>

          <article className="space-y-4 rounded-2xl border border-brand/20 bg-cream p-6">
            <h2 className="font-ui text-2xl text-brand">Node Status</h2>
            <div className="rounded-xl bg-page p-4">
              <p className="font-body text-sm text-brand/70">
                Personal IPFS node
              </p>
              <p className="mt-1 font-ui text-xl text-brand">
                {nodeStatus === "active" ? "Active" : "Needs setup"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-body text-sm text-brand/80">
                Your node is currently running and syncing data locally.
              </p>
              <p className="font-body text-xs text-brand/60">
                Last synced: Just now
              </p>
            </div>
          </article>

          <article className="space-y-4 rounded-2xl border border-brand/20 bg-cream p-6">
            <h2 className="font-ui text-2xl text-brand">Membership</h2>
            <p className="font-body text-sm text-brand/80">
              Share ownership: <strong>1 member share</strong>.
            </p>
            <p className="font-body text-sm text-brand/80">
              Voting rights: <strong>enabled</strong>.
            </p>
            <p className="font-body text-sm text-brand/80">
              Onboarding:{" "}
              <strong>
                {user.onboardingComplete ? "complete" : "in progress"}
              </strong>
              .
            </p>
          </article>

          <article className="space-y-4 rounded-2xl border border-brand/20 bg-cream p-6">
            <h2 className="font-ui text-2xl text-brand">Session</h2>
            <p className="font-body text-sm text-brand/80">
              Signed in as {user.fullName}.
            </p>
            <Button type="button" text="Sign Out" onClick={handleSignOut} />
          </article>
        </div>
      </section>
    </main>
  );
}

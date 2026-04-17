import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { useSOARState } from "../../hooks/useSOARState";

export default function Join() {
  const [state, dispatch] = useSOARState();
  const navigate = useNavigate();
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  if (state.user) {
    return (
      <Navigate
        to={state.user.onboardingComplete ? "/learn" : "/onboarding"}
        replace
      />
    );
  }

  const emailTaken = state.peers.some(
    (peer) => peer.email.toLowerCase() === form.email.trim().toLowerCase(),
  );

  const moveToReview = (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please complete every field before you continue.");
      return;
    }

    if (emailTaken) {
      setError(
        "That email is already registered on this device. Try logging in.",
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Choose a password with at least 6 characters for this prototype.",
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your password confirmation does not match.");
      return;
    }

    setError("");
    setStep("review");
  };

  const createPeer = async (event) => {
    event.preventDefault();

    if (!acknowledged) {
      setError(
        "Please confirm that you understand this is a local prototype preview.",
      );
      return;
    }

    setStatus("loading");

    dispatch({
      type: "REGISTER_PEER",
      payload: {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      },
    });

    navigate("/onboarding", { replace: true });
  };

  return (
    <main className="mx-auto flex w-full max-w-360 items-center px-6 pb-20 pt-28 md:pt-34">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-4xl border border-brand/15 bg-white/75 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:grid-cols-[1.05fr_0.95fr] md:p-8">
        <section className="space-y-6">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-sky/35 px-3 py-1 font-ui text-[0.7rem] tracking-[0.14em] text-brand">
              Join
            </span>
            <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] leading-[0.92] text-brand">
              Become a peer.
            </h1>
            <p className="max-w-xl font-body text-base leading-relaxed text-brand/80 md:text-lg">
              Join a community of peers supporting each other's growth. Your
              peership helps us keep the platform running and accessible to
              everyone.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ValueCard
              title="Personalise"
              body="Save your learning interests, progress, reflections, and creations all in one place."
            />
            <ValueCard
              title="Learn your way"
              body="Choose subjects that matter to you, complete sessions at your own pace, and track your progress."
            />
            <ValueCard
              title="Connect"
              body="Join a community of like-minded individuals. Share, reflect, and grow together."
            />
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-brand/12 bg-page p-5 md:p-6">
          {step === "details" ? (
            <form onSubmit={moveToReview} className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-ui text-2xl text-brand">
                  Create your account
                </h2>
                <p className="font-body text-sm text-brand/70">
                  Get started with your account today.
                </p>
              </div>

              <InputField
                label="Full name"
                name="join-full-name"
                value={form.fullName}
                onValueChange={(fullName) =>
                  setForm((current) => ({ ...current, fullName }))
                }
                placeholder="Jane Smith"
                autoComplete="name"
              />

              <InputField
                label="Email address"
                name="join-email"
                type="email"
                value={form.email}
                onValueChange={(email) =>
                  setForm((current) => ({ ...current, email }))
                }
                placeholder="jane@example.com"
                autoComplete="email"
              />

              <InputField
                label="Password"
                name="join-password"
                type="password"
                value={form.password}
                onValueChange={(password) =>
                  setForm((current) => ({ ...current, password }))
                }
                placeholder="Create a secure password"
                autoComplete="new-password"
              />

              <InputField
                label="Confirm password"
                name="join-confirm-password"
                type="password"
                value={form.confirmPassword}
                onValueChange={(confirmPassword) =>
                  setForm((current) => ({ ...current, confirmPassword }))
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
              />

              {error ? (
                <p className="font-body text-sm text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}

              <Button type="submit" text="Continue" />
            </form>
          ) : (
            <form onSubmit={createPeer} className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-ui text-2xl text-brand">
                  Review your peership
                </h2>
                <p className="font-body text-sm text-brand/70">
                  Please check your details before confirming.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl border border-brand/12 bg-white p-5">
                <SummaryRow label="Name" value={form.fullName} />
                <SummaryRow
                  label="Email"
                  value={form.email.trim().toLowerCase()}
                />
                <SummaryRow label="Peership type" value="Permanent" />
                <SummaryRow label="Peership fee" value="£1.00" />
              </div>

              <div className="rounded-3xl border border-brand/12 bg-white p-5">
                <p className="font-body text-sm leading-relaxed text-brand/76">
                  Your peership supports our mission to make personal growth
                  accessible to everyone. As a peer, you'll have full access to
                  all learning materials, the community forum, and our
                  reflection tools.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-brand/12 bg-white px-4 py-4">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                  className="mt-1 size-4 rounded border border-navy/40 accent-brand"
                />
                <span className="font-body text-sm leading-relaxed text-brand/76">
                  I agree to the terms of peership and understand my
                  contribution helps keep this community thriving.
                </span>
              </label>

              {error ? (
                <p className="font-body text-sm text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  text="Back"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => {
                    setError("");
                    setStep("details");
                  }}
                />
                <Button
                  type="submit"
                  status={status}
                  loadingText="Setting up your account..."
                  text="Complete Registration"
                  fullWidth={false}
                />
              </div>
            </form>
          )}

          <p className="mt-6 border-t border-brand/12 pt-5 font-body text-sm text-brand/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand hover:underline"
            >
              Sign in
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

const ValueCard = ({ title, body }) => (
  <article className="rounded-3xl border border-brand/12 bg-page p-4">
    <h2 className="font-ui text-xl text-brand">{title}</h2>
    <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
      {body}
    </p>
  </article>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <span className="font-body text-sm text-brand/62">{label}</span>
    <span className="font-body text-sm font-medium text-brand">{value}</span>
  </div>
);

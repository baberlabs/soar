import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { useSOARDispatch, useSOARHelpers, useSOARState } from "../../store";

export default function Login() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const { authenticatePeer } = useSOARHelpers();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  if (state.user) {
    return (
      <Navigate
        to={state.user.onboardingComplete ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const peer = authenticatePeer(normalizedEmail, password);
    const knownEmail = state.peers.some(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail,
    );

    if (!normalizedEmail || !password.trim()) {
      setError("Enter both your email and password.");
      return;
    }

    if (!knownEmail) {
      setError("No account with that email exists on this device yet.");
      return;
    }

    if (!peer) {
      setError(
        "That password does not match the account saved on this device.",
      );
      return;
    }

    setError("");
    setStatus("loading");
    dispatch({
      type: "LOGIN_PEER",
      payload: { userId: peer.id },
    });

    navigate(peer.onboardingComplete ? "/dashboard" : "/onboarding", {
      replace: true,
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-360 items-center px-6 pb-20 pt-28 md:pt-34">
      <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-4xl border border-brand/15 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:grid-cols-[0.95fr_1.05fr] md:p-8">
        <section className="space-y-6">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-sky/35 px-3 py-1 font-ui text-[0.7rem] tracking-[0.14em] text-brand">
              Log In
            </span>
            <h1 className="font-display text-[clamp(3rem,7vw,5.25rem)] leading-[0.92] text-brand">
              Welcome back.
            </h1>
            <p className="max-w-xl font-body text-base leading-relaxed text-brand/80 md:text-lg">
              Sign in to continue your current learning paths, reflections,
              creations, and forum activity on this device.
            </p>
          </div>

          <div className="rounded-3xl border border-brand/12 bg-page p-5">
            <p className="font-ui text-sm tracking-[0.12em] text-brand/62">
              Prototype reminder
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-brand/74">
              Accounts in this preview are local to this browser. If you created
              an account in another browser or cleared your storage, it will not
              appear here.
            </p>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-brand/12 bg-page p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="font-ui text-2xl text-brand">
                Sign in to your account
              </h2>
              <p className="font-body text-sm text-brand/70">
                Use the email and password you created in the join flow.
              </p>
            </div>

            <InputField
              label="Email address"
              name="login-email"
              type="email"
              value={email}
              onValueChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="login-password"
              type="password"
              value={password}
              onValueChange={setPassword}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {error ? (
              <p className="font-body text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              status={status}
              loadingText="Signing in..."
              text="Log In"
            />
          </form>

          <p className="mt-6 border-t border-brand/12 pt-5 font-body text-sm text-brand/70">
            Need a local account first?{" "}
            <Link
              to="/join"
              className="font-semibold text-brand hover:underline"
            >
              Create one here
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

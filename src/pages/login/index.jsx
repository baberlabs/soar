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
      <section className="soft-enter mx-auto w-full max-w-lg gap-8 sm:rounded-4xl sm:border sm:border-brand/15 sm:p-6 sm:shadow-[0_24px_48px_rgba(75,81,149,0.08)] sm:backdrop-blur-sm md:grid-cols-[0.95fr_1.05fr] md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <h1 className="font-ui text-2xl text-brand">
              Sign in to your account
            </h1>
            <p className="font-body text-sm text-brand/70">
              Continue your journey to the liberation of self.
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
          Need an account first?{" "}
          <Link to="/join" className="font-semibold text-brand hover:underline">
            Create one here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

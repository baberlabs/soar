import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { useSOARState } from "../../hooks/useSOARState";

const MIN_CONTRIBUTION = 1;

const PAYMENT_METHODS = [
  { id: "card", label: "Debit or credit card" },
  { id: "paypal", label: "PayPal" },
  { id: "applepay", label: "Apple Pay" },
  { id: "googlepay", label: "Google Pay" },
  { id: "bank", label: "Bank transfer" },
  { id: "bitcoin", label: "Bitcoin" },
];

const PAYMENT_METHOD_LABELS = {
  card: "Debit or credit card",
  paypal: "PayPal",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  bank: "Bank transfer",
  bitcoin: "Bitcoin",
};

const JOIN_FLOW_STEPS = [
  { id: "details", label: "Account" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
  { id: "how-soar-works", label: "How SOAR works" },
];

export default function Join() {
  const [state, dispatch] = useSOARState();
  const navigate = useNavigate();
  const [step, setStep] = useState("details");
  const [registeredHere, setRegisteredHere] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [payment, setPayment] = useState({
    contribution: "1.00",
    method: "card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    postcode: "",
    paypalEmail: "",
    bankAccountName: "",
    sortCode: "",
    accountNumber: "",
    bitcoinAddress: "",
  });
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("idle");
  const [paymentStatus, setPaymentStatus] = useState("idle");

  const contributionValue = Number.parseFloat(payment.contribution);
  const contributionAmount =
    Number.isFinite(contributionValue) && contributionValue > 0
      ? contributionValue
      : MIN_CONTRIBUTION;
  const contributionDisplay = `£${contributionAmount.toFixed(2)}`;
  const currentFlowIndex = JOIN_FLOW_STEPS.findIndex(
    (flowStep) => flowStep.id === step,
  );

  if (state.user && !registeredHere) {
    return (
      <Navigate
        to={state.user.onboardingComplete ? "/learn" : "/onboarding"}
        replace
      />
    );
  }

  const emailTaken = state.members?.some(
    (member) => member.email.toLowerCase() === form.email.trim().toLowerCase(),
  );

  const moveToPayment = (event) => {
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
    setPaymentReceipt(null);
    setStep("payment");
  };

  const isValidCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    // Unnecessary for simulated card payment

    // let sum = 0;
    // let shouldDouble = false;

    // for (let i = digits.length - 1; i >= 0; i -= 1) {
    //   let digit = Number(digits[i]);

    //   if (shouldDouble) {
    //     digit *= 2;
    //     if (digit > 9) {
    //       digit -= 9;
    //     }
    //   }

    //   sum += digit;
    //   shouldDouble = !shouldDouble;
    // }

    // return sum % 10 === 0;

    return true;
  };

  const isValidExpiry = (value) => {
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) {
      return false;
    }

    const month = Number(match[1]);
    const year = Number(`20${match[2]}`);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear) {
      return false;
    }

    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  };

  const isValidBitcoinAddress = (value) => {
    const trimmed = value.trim();
    const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const segwitPattern = /^bc1[ac-hj-np-z02-9]{11,71}$/;

    return legacyPattern.test(trimmed) || segwitPattern.test(trimmed);
  };

  const processPayment = async (event) => {
    event.preventDefault();

    if (
      !Number.isFinite(contributionValue) ||
      contributionValue < MIN_CONTRIBUTION
    ) {
      setError("Enter a contribution of at least £1.00.");
      return;
    }

    if (payment.contribution.includes(".")) {
      const decimals = payment.contribution.split(".")[1] ?? "";
      if (decimals.length > 2) {
        setError("Use a valid amount with up to two decimal places.");
        return;
      }
    }

    if (payment.method === "card") {
      if (!payment.cardName.trim()) {
        setError("Enter the cardholder name.");
        return;
      }

      if (!isValidCardNumber(payment.cardNumber)) {
        setError("Enter a valid card number.");
        return;
      }

      if (!isValidExpiry(payment.expiry)) {
        setError("Enter a valid expiry date in MM/YY format.");
        return;
      }

      if (!/^\d{3,4}$/.test(payment.cvc.trim())) {
        setError("Enter a valid security code.");
        return;
      }

      if (payment.postcode.trim().length < 5) {
        setError("Enter a valid billing postcode.");
        return;
      }
    }

    if (payment.method === "paypal") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payment.paypalEmail.trim())) {
        setError("Enter a valid PayPal email address.");
        return;
      }
    }

    if (payment.method === "bank") {
      if (!payment.bankAccountName.trim()) {
        setError("Enter the account holder name.");
        return;
      }

      if (!/^\d{2}-?\d{2}-?\d{2}$/.test(payment.sortCode.trim())) {
        setError("Enter a valid UK sort code.");
        return;
      }

      if (!/^\d{8}$/.test(payment.accountNumber.trim())) {
        setError("Enter a valid 8-digit account number.");
        return;
      }
    }

    if (payment.method === "bitcoin") {
      if (!isValidBitcoinAddress(payment.bitcoinAddress)) {
        setError("Enter a valid Bitcoin wallet address.");
        return;
      }
    }

    setError("");
    setPaymentStatus("loading");

    await new Promise((resolve) => {
      setTimeout(resolve, 900);
    });

    const cardDigits = payment.cardNumber.replace(/\D/g, "");
    const accountDigits = payment.accountNumber.replace(/\D/g, "");
    setPaymentReceipt({
      transactionId: `SOAR-${Date.now().toString().slice(-8)}`,
      amount: contributionDisplay,
      paidAt: new Date().toISOString(),
      method: payment.method,
      paymentRef:
        payment.method === "card"
          ? `•••• ${cardDigits.slice(-4)}`
          : payment.method === "paypal"
            ? payment.paypalEmail.trim().toLowerCase()
            : payment.method === "bank"
              ? `Account ending ${accountDigits.slice(-4)}`
              : payment.method === "bitcoin"
                ? `${payment.bitcoinAddress.trim().slice(0, 8)}...${payment.bitcoinAddress.trim().slice(-6)}`
                : "Wallet authorisation",
    });

    setPaymentStatus("idle");
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

    if (!paymentReceipt) {
      setError("Complete payment before you confirm your peership.");
      return;
    }

    setRegistrationStatus("loading");

    dispatch({
      type: "REGISTER_MEMBER",
      payload: {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        paid: true,
      },
    });

    setRegisteredHere(true);
    setRegistrationStatus("idle");
    setError("");
    setStep("how-soar-works");
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
          <div className="mb-5 space-y-3 soft-enter">
            <div className="flex items-center justify-between">
              <p className="font-ui text-xs tracking-[0.15em] text-brand/62">
                REGISTRATION FLOW
              </p>
              <p className="font-body text-xs text-brand/62">
                Step {Math.max(currentFlowIndex + 1, 1)} of{" "}
                {JOIN_FLOW_STEPS.length}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {JOIN_FLOW_STEPS.map((flowStep, index) => {
                const isActive = flowStep.id === step;
                const isComplete = index < currentFlowIndex;

                return (
                  <div key={flowStep.id} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-400 ${
                        isActive || isComplete ? "bg-brand" : "bg-brand/18"
                      }`}
                    />
                    <p
                      className={`font-body text-[0.68rem] leading-tight ${
                        isActive
                          ? "text-brand"
                          : isComplete
                            ? "text-brand/78"
                            : "text-brand/52"
                      }`}
                    >
                      {flowStep.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {step === "details" ? (
            <form onSubmit={moveToPayment} className="space-y-5 soft-enter">
              <div className="space-y-1">
                <h2 className="font-ui text-2xl text-brand">
                  Create your account
                </h2>
                <p className="font-body text-sm text-brand/70">
                  Enter your details before payment.
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
          ) : step === "payment" ? (
            <form onSubmit={processPayment} className="space-y-5 soft-enter">
              <div className="space-y-1">
                <h2 className="font-ui text-2xl text-brand">
                  Pay peership fee
                </h2>
                <p className="font-body text-sm text-brand/70">
                  Choose your contribution and payment method. Minimum peership
                  contribution is £1.00.
                </p>
              </div>

              <div className="rounded-3xl border border-brand/12 p-5">
                <InputField
                  label="Contribution amount (GBP)"
                  name="join-contribution"
                  type="number"
                  value={payment.contribution}
                  onValueChange={(contribution) =>
                    setPayment((current) => ({ ...current, contribution }))
                  }
                  placeholder="1.00"
                />
                <p className="mt-2 font-body text-xs leading-relaxed text-brand/68">
                  Minimum contribution: £1.00. You can contribute more to
                  support SOAR's community model.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl border border-brand/12 p-5">
                <p className="font-ui text-sm text-brand">Payment method</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 rounded-2xl border border-brand/12 bg-page px-3 py-3"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        checked={payment.method === method.id}
                        onChange={() =>
                          setPayment((current) => ({
                            ...current,
                            method: method.id,
                          }))
                        }
                        className="size-4 border border-navy/40 accent-brand"
                      />
                      <span className="font-body text-sm text-brand/80">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-brand/12 p-5">
                <SummaryRow label="Amount" value={contributionDisplay} />
                <SummaryRow
                  label="Charge type"
                  value="One-off peership share"
                />
              </div>

              {payment.method === "card" ? (
                <>
                  <InputField
                    label="Cardholder name"
                    name="join-card-name"
                    value={payment.cardName}
                    onValueChange={(cardName) =>
                      setPayment((current) => ({ ...current, cardName }))
                    }
                    placeholder="Jane Smith"
                    autoComplete="cc-name"
                  />

                  <InputField
                    label="Card number"
                    name="join-card-number"
                    value={payment.cardNumber}
                    onValueChange={(cardNumber) =>
                      setPayment((current) => ({ ...current, cardNumber }))
                    }
                    placeholder="4242 4242 4242 4242"
                    autoComplete="cc-number"
                  />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <InputField
                      label="Expiry"
                      name="join-card-expiry"
                      value={payment.expiry}
                      onValueChange={(expiry) =>
                        setPayment((current) => ({ ...current, expiry }))
                      }
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                    />

                    <InputField
                      label="Security code"
                      name="join-card-cvc"
                      value={payment.cvc}
                      onValueChange={(cvc) =>
                        setPayment((current) => ({ ...current, cvc }))
                      }
                      placeholder="123"
                      autoComplete="cc-csc"
                    />

                    <InputField
                      label="Billing postcode"
                      name="join-postcode"
                      value={payment.postcode}
                      onValueChange={(postcode) =>
                        setPayment((current) => ({ ...current, postcode }))
                      }
                      placeholder="SW1A 1AA"
                      autoComplete="postal-code"
                    />
                  </div>
                </>
              ) : null}

              {payment.method === "paypal" ? (
                <InputField
                  label="PayPal email"
                  name="join-paypal-email"
                  type="email"
                  value={payment.paypalEmail}
                  onValueChange={(paypalEmail) =>
                    setPayment((current) => ({ ...current, paypalEmail }))
                  }
                  placeholder="jane@example.com"
                  autoComplete="email"
                />
              ) : null}

              {payment.method === "bank" ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <InputField
                    label="Account holder"
                    name="join-bank-account-name"
                    value={payment.bankAccountName}
                    onValueChange={(bankAccountName) =>
                      setPayment((current) => ({ ...current, bankAccountName }))
                    }
                    placeholder="Jane Smith"
                  />
                  <InputField
                    label="Sort code"
                    name="join-bank-sort-code"
                    value={payment.sortCode}
                    onValueChange={(sortCode) =>
                      setPayment((current) => ({ ...current, sortCode }))
                    }
                    placeholder="12-34-56"
                  />
                  <InputField
                    label="Account number"
                    name="join-bank-account-number"
                    value={payment.accountNumber}
                    onValueChange={(accountNumber) =>
                      setPayment((current) => ({ ...current, accountNumber }))
                    }
                    placeholder="12345678"
                  />
                </div>
              ) : null}

              {payment.method === "bitcoin" ? (
                <InputField
                  label="Bitcoin wallet address"
                  name="join-bitcoin-address"
                  value={payment.bitcoinAddress}
                  onValueChange={(bitcoinAddress) =>
                    setPayment((current) => ({ ...current, bitcoinAddress }))
                  }
                  placeholder="bc1..."
                />
              ) : null}

              {payment.method === "applepay" ||
              payment.method === "googlepay" ? (
                <p className="rounded-2xl border border-brand/12 px-4 py-3 font-body text-xs leading-relaxed text-brand/68">
                  You will approve this payment with your device wallet during
                  authorisation.
                </p>
              ) : null}

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
                  status={paymentStatus}
                  loadingText="Authorising payment..."
                  text={`Pay ${contributionDisplay}`}
                  fullWidth={false}
                />
              </div>
            </form>
          ) : step === "review" ? (
            <form onSubmit={createPeer} className="space-y-5 soft-enter">
              <div className="space-y-1">
                <h2 className="font-ui text-2xl text-brand">
                  Review your peership
                </h2>
                <p className="font-body text-sm text-brand/70">
                  Check your details and payment before confirming.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl border border-brand/12 p-5">
                <SummaryRow label="Name" value={form.fullName} />
                <SummaryRow
                  label="Email"
                  value={form.email.trim().toLowerCase()}
                />
                <SummaryRow label="Peership type" value="Permanent" />
                <SummaryRow label="Contribution" value={contributionDisplay} />
              </div>

              <div className="space-y-3 rounded-3xl border border-brand/12 p-5">
                <SummaryRow
                  label="Payment status"
                  value={paymentReceipt ? "Authorised" : "Pending"}
                />
                <SummaryRow
                  label="Method"
                  value={
                    paymentReceipt
                      ? PAYMENT_METHOD_LABELS[paymentReceipt.method]
                      : "Not selected"
                  }
                />
                <SummaryRow
                  label="Reference"
                  value={
                    paymentReceipt ? paymentReceipt.paymentRef : "Not provided"
                  }
                />
                <SummaryRow
                  label="Transaction"
                  value={paymentReceipt?.transactionId ?? "Not available"}
                />
              </div>

              <div className="rounded-3xl border border-brand/12 p-5">
                <p className="font-body text-sm leading-relaxed text-brand/76">
                  Your peership supports our mission to make personal growth
                  accessible to everyone. As a peer, you'll have full access to
                  all learning materials, the community forum, and our
                  reflection tools.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-brand/12 px-4 py-4">
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
                  text="Back to payment"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => {
                    setError("");
                    setStep("payment");
                  }}
                />
                <Button
                  type="submit"
                  status={registrationStatus}
                  loadingText="Setting up your account..."
                  text="Complete Registration"
                  fullWidth={false}
                />
              </div>
            </form>
          ) : (
            <section className="space-y-5 soft-enter">
              <div className="space-y-1">
                <h2 className="font-ui text-2xl text-brand">How SOAR works</h2>
                <p className="font-body text-sm text-brand/70">
                  You are now a peer. This is one continuous journey from
                  joining through onboarding and into your first session.
                </p>
              </div>

              <div className="space-y-4 rounded-3xl border border-brand/12 p-5 soft-rise soft-delay-1">
                <h3 className="font-ui text-lg text-brand">
                  Your SOAR journey
                </h3>

                <JourneyItem
                  phase="Now"
                  title="You joined as a peer"
                  body="You are part of a peer-owned platform where one peer has one vote and your contribution supports shared progress."
                />
                <JourneyItem
                  phase="Next"
                  title="Onboarding sets your direction"
                  body="You choose interests and your preferred learning style so SOAR can shape your first curriculum around what matters to you."
                />
                <JourneyItem
                  phase="Then"
                  title="You build your first curriculum"
                  body="You select subjects, set intentions, and enter focused sessions with clear outcomes instead of endless feed behaviour."
                />
                <JourneyItem
                  phase="Ongoing"
                  title="You learn, create, reflect, and contribute"
                  body="You produce work, review progress monthly, connect with peers, and influence product direction through shared governance."
                />

                <p className="rounded-2xl border border-brand/12 bg-white/55 px-4 py-3 font-body text-xs leading-relaxed text-brand/68 soft-rise soft-delay-2">
                  Onboarding takes a few minutes and gives you a usable start: a
                  clear learning direction, your first subject path, and an
                  immediate next action.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 soft-rise soft-delay-3">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full border border-brand/20 px-5 py-3 font-ui text-sm tracking-wide text-brand transition hover:border-brand/35"
                >
                  Read Full About SOAR
                </Link>
                <Button
                  type="button"
                  text="Continue to Onboarding"
                  fullWidth={false}
                  onClick={() => navigate("/onboarding", { replace: true })}
                />
              </div>
            </section>
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

const JourneyItem = ({ phase, title, body }) => (
  <article className="rounded-2xl border border-brand/12 bg-white/45 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand/22">
    <p className="font-ui text-[0.7rem] tracking-[0.15em] text-brand/58 uppercase">
      {phase}
    </p>
    <h4 className="mt-1 font-ui text-lg text-brand">{title}</h4>
    <p className="mt-1 font-body text-sm leading-relaxed text-brand/74">
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

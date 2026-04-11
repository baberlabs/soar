import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../../components/Button";
import { InputField } from "../../components/InputField";
import { useSOARState } from "../../hooks/useSOARState";

const MIN_DONATION = 1;
const MAX_DONATION = 5000;

const DONATION_AMOUNTS = [1, 5, 25, 50];

const PAYMENT_METHODS = [
  { id: "card", label: "Visa / Debit Card", description: "Card payment" },
  { id: "google-pay", label: "Google Pay", description: "Fast checkout" },
  { id: "apple-pay", label: "Apple Pay", description: "Fast checkout" },
  { id: "paypal", label: "PayPal", description: "Pay with your account" },
  { id: "bank", label: "Bank Transfer", description: "Sort code + account" },
  { id: "bitcoin", label: "Bitcoin", description: "Wallet transfer" },
];

export function Donate() {
  const [state] = useSOARState();
  const [step, setStep] = useState("amount");
  const [amountChoice, setAmountChoice] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardName, setCardName] = useState(state.user?.fullName ?? "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [email, setEmail] = useState(state.user?.email ?? "");
  const [bankAccount, setBankAccount] = useState("");
  const [bankSortCode, setBankSortCode] = useState("");
  const [bitcoinWallet, setBitcoinWallet] = useState("");
  const [billingPostcode, setBillingPostcode] = useState("");
  const [status, setStatus] = useState("idle");
  const [processingStep, setProcessingStep] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const processingTimersRef = useRef([]);

  const selectedAmount = useMemo(() => {
    if (amountChoice === "custom") {
      const parsed = Number(customAmount);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return Number(amountChoice);
  }, [amountChoice, customAmount]);

  const resolvedAmount = Number(selectedAmount.toFixed(2));

  const amountIsValid =
    Number.isFinite(resolvedAmount) &&
    resolvedAmount >= MIN_DONATION &&
    resolvedAmount <= MAX_DONATION;

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 2,
    }).format(value);

  const amountLabel = formatAmount(Math.max(resolvedAmount || 0, 0));

  useEffect(() => {
    return () => {
      processingTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  const clearProcessingTimers = () => {
    processingTimersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    processingTimersRef.current = [];
  };

  const handleContinueToPayment = (event) => {
    event.preventDefault();

    if (!amountIsValid) {
      setError(
        `Choose a donation between ${formatAmount(MIN_DONATION)} and ${formatAmount(MAX_DONATION)}.`,
      );
      return;
    }

    setError("");
    setStep("payment");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amountIsValid) {
      setError(
        `Choose a donation between ${formatAmount(MIN_DONATION)} and ${formatAmount(MAX_DONATION)}.`,
      );
      return;
    }

    if (paymentMethod === "card") {
      if (!/^[A-Za-z]{2,}\s+[A-Za-z].+/.test(cardName.trim())) {
        setError("Enter the name exactly as it appears on the card.");
        return;
      }

      if (!/^(?:\d{4} ?){3}\d{4}$/.test(cardNumber.trim())) {
        setError("Enter a valid card number in groups of 4 digits.");
        return;
      }

      if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry.trim())) {
        setError("Use MM/YY for the expiry date.");
        return;
      }

      if (!/^\d{3,4}$/.test(cardCvc.trim())) {
        setError("Enter a 3 or 4 digit CVC.");
        return;
      }
    }

    if (paymentMethod === "bank") {
      if (!/^\d{8}$/.test(bankAccount.trim())) {
        setError("Enter an 8-digit account number.");
        return;
      }

      if (!/^\d{6}$/.test(bankSortCode.replace(/-/g, ""))) {
        setError("Enter a valid sort code.");
        return;
      }
    }

    if (paymentMethod === "bitcoin") {
      if (bitcoinWallet.trim().length < 20) {
        setError("Enter a valid wallet address.");
        return;
      }
    }

    if (!billingPostcode.trim()) {
      setError("Enter a billing postcode.");
      return;
    }

    setError("");
    clearProcessingTimers();
    setStatus("loading");
    setProcessingStep(1);

    const nextReceipt = {
      id: `SOAR-${Date.now().toString().slice(-8)}`,
      amount: resolvedAmount,
      method:
        PAYMENT_METHODS.find((method) => method.id === paymentMethod)?.label ??
        "Visa / Debit Card",
      createdAt: new Date().toISOString(),
      donorEmail: email.trim() || state.user?.email || null,
      last4:
        paymentMethod === "card"
          ? cardNumber.replace(/\s/g, "").slice(-4)
          : null,
    };

    setReceipt(nextReceipt);

    processingTimersRef.current.push(
      window.setTimeout(() => {
        setProcessingStep(2);
      }, 700),
    );

    processingTimersRef.current.push(
      window.setTimeout(() => {
        setProcessingStep(3);
      }, 1450),
    );

    processingTimersRef.current.push(
      window.setTimeout(() => {
        setProcessingStep(4);
      }, 2050),
    );

    processingTimersRef.current.push(
      window.setTimeout(() => {
        setStatus("success");
      }, 2650),
    );
  };

  if (status === "success") {
    return (
      <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
        <section className="mx-auto grid max-w-5xl gap-8 rounded-4xl border border-brand/15 bg-white/75 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="space-y-5">
            <p className="font-ui text-sm tracking-[0.18em] text-sage">
              Donation complete
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-brand">
              Thank you for supporting SOAR.
            </h1>
            <p className="max-w-2xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
              Your contribution of {amountLabel} will help keep the community
              running, support new ideas, and fund the next thing worth trying.
            </p>
            <div className="rounded-3xl border border-brand/12 bg-page p-5">
              <p className="font-body text-sm text-brand/70">Receipt</p>
              <p className="mt-1 font-ui text-lg text-brand">
                Ref {receipt?.id ?? "SOAR-00000000"}
              </p>
              <p className="mt-1 font-body text-xs text-brand/60">
                {receipt?.createdAt
                  ? new Date(receipt.createdAt).toLocaleString("en-GB")
                  : "Pending"}
              </p>
              <p className="mt-4 font-body text-sm text-brand/70">
                Payment method
              </p>
              <p className="mt-1 font-ui text-2xl text-brand">
                {receipt?.method ?? "Card"}
              </p>
              {receipt?.last4 ? (
                <p className="mt-1 font-body text-sm text-brand/72">
                  Card ending in {receipt.last4}
                </p>
              ) : null}
              {receipt?.donorEmail ? (
                <p className="mt-1 font-body text-sm text-brand/72">
                  Receipt sent to {receipt.donorEmail}
                </p>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4 rounded-[1.75rem] border border-brand/12 bg-page p-6">
            <h2 className="font-ui text-2xl text-brand">
              What your gift supports
            </h2>
            <ul className="space-y-3">
              <InfoBullet text="Community events and local gatherings." />
              <InfoBullet text="New learning paths, sessions, and tools." />
              <InfoBullet text="Member-led ideas, governance, and improvements." />
            </ul>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="grid gap-6 rounded-4xl border border-brand/15 bg-white/70 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="space-y-4">
            <p className="font-ui text-sm tracking-[0.18em] text-sage">
              Support SOAR
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-brand">
              Keep the community moving.
            </h1>
            <p className="max-w-2xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
              SOAR runs on member support. Donations help keep the platform
              open, fund experiments, and back the next round of useful things
              for the community.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Minimum" value="£1" />
              <StatCard label="Common gifts" value="£5 / £25 / £50" />
              <StatCard
                label="Maximum"
                value={`£${MAX_DONATION.toLocaleString("en-GB")}`}
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <SecureBadge text="Secure checkout" />
              <SecureBadge text="Encrypted payment form" />
              <SecureBadge text="Instant confirmation" />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-brand/12 bg-page p-6">
            <h2 className="font-ui text-2xl text-brand">Why donate</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-brand/76">
              Your support helps SOAR stay alive, improve steadily, and try new
              things without losing its focus on members.
            </p>
            <div className="mt-5 space-y-3">
              <ImpactRow
                title="Community"
                body="Support local activity and shared spaces."
              />
              <ImpactRow
                title="Product"
                body="Fund new features, refinements, and experiments."
              />
              <ImpactRow
                title="Independence"
                body="Keep SOAR member-led and resilient."
              />
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={
              step === "amount" ? handleContinueToPayment : handleSubmit
            }
            noValidate
            className="space-y-6 rounded-4xl border border-brand/15 bg-white/75 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-8"
          >
            <ProgressBar step={step} />

            {step === "amount" ? (
              <AmountStep
                amountChoice={amountChoice}
                setAmountChoice={setAmountChoice}
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                amountLabel={amountLabel}
                amountIsValid={amountIsValid}
                state={state}
                email={email}
                setEmail={setEmail}
              />
            ) : null}

            {step === "payment" ? (
              <PaymentStep
                amountLabel={amountLabel}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardName={cardName}
                setCardName={setCardName}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
                bankAccount={bankAccount}
                setBankAccount={setBankAccount}
                bankSortCode={bankSortCode}
                setBankSortCode={setBankSortCode}
                bitcoinWallet={bitcoinWallet}
                setBitcoinWallet={setBitcoinWallet}
                billingPostcode={billingPostcode}
                setBillingPostcode={setBillingPostcode}
                processingStep={processingStep}
                status={status}
              />
            ) : null}

            {error ? (
              <p className="font-body text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              {step === "payment" ? (
                <Button
                  type="button"
                  text="Back"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => {
                    setError("");
                    setStep("amount");
                  }}
                />
              ) : null}
              <Button
                type="submit"
                text={step === "amount" ? "Continue" : "Complete Donation"}
                loadingText={
                  step === "amount" ? "Continuing..." : "Processing..."
                }
                status={status}
                fullWidth={false}
                disabled={
                  step === "amount" ? !amountIsValid : status === "loading"
                }
              />
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-4xl border border-brand/15 bg-cream p-6 shadow-[0_24px_48px_rgba(75,81,149,0.05)]">
              <h2 className="font-ui text-2xl text-brand">Your donation</h2>
              <div className="mt-4 rounded-3xl border border-brand/12 bg-page p-5">
                <p className="font-body text-sm text-brand/70">
                  Selected amount
                </p>
                <p className="mt-1 font-display text-4xl text-brand">
                  {amountLabel}
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
                  Minimum {formatAmount(MIN_DONATION)}. Maximum{" "}
                  {formatAmount(MAX_DONATION)}.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {DONATION_AMOUNTS.map((amount) => (
                    <DonationChip
                      key={amount}
                      label={`£${amount}`}
                      selected={amountChoice === String(amount)}
                      onClick={() => setAmountChoice(String(amount))}
                    />
                  ))}
                  <DonationChip
                    label="Custom"
                    selected={amountChoice === "custom"}
                    onClick={() => setAmountChoice("custom")}
                  />
                </div>
                {amountChoice === "custom" ? (
                  <p className="font-body text-xs text-brand/65">
                    Enter any amount from {formatAmount(MIN_DONATION)} to{" "}
                    {formatAmount(MAX_DONATION)}.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-4xl border border-brand/15 bg-page p-6">
              <h2 className="font-ui text-2xl text-brand">Payment method</h2>
              <div className="mt-4 rounded-3xl border border-brand/12 bg-cream p-4">
                <p className="font-ui text-base text-brand">
                  {PAYMENT_METHODS.find((method) => method.id === paymentMethod)
                    ?.label ?? "Visa / Debit Card"}
                </p>
                <p className="mt-1 font-body text-xs text-brand/65">
                  {PAYMENT_METHODS.find((method) => method.id === paymentMethod)
                    ?.description ?? "Card payment"}
                </p>
              </div>
              <p className="mt-3 font-body text-xs leading-relaxed text-brand/65">
                You can change this in the payment section before you complete
                your donation.
              </p>
              <div className="mt-4 rounded-3xl border border-brand/12 bg-page p-4">
                <p className="font-ui text-sm tracking-[0.12em] text-brand/60">
                  Accepted methods
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
                  Visa or Debit Card, Google Pay, Apple Pay, PayPal, Bank
                  Transfer, and Bitcoin.
                </p>
              </div>

              <div className="mt-4 rounded-3xl border border-brand/12 bg-page p-4">
                <p className="font-ui text-sm tracking-[0.12em] text-brand/60">
                  Transaction summary
                </p>
                <SummaryLine label="Donation" value={amountLabel} />
                <SummaryLine label="Processing fee" value="£0.00" />
                <SummaryLine label="Total charged" value={amountLabel} strong />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const ProgressBar = ({ step }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <p className="font-ui text-xs tracking-[0.12em] text-brand/60">Step 1</p>
      <p className="font-ui text-xs tracking-[0.12em] text-brand/60">Step 2</p>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-brand/10">
      <div
        className="h-full rounded-full bg-brand transition-all duration-500"
        style={{ width: step === "amount" ? "50%" : "100%" }}
      />
    </div>
  </div>
);

const AmountStep = ({
  amountChoice,
  setAmountChoice,
  customAmount,
  setCustomAmount,
  amountLabel,
  amountIsValid,
  state,
  email,
  setEmail,
}) => (
  <section className="space-y-6">
    <div className="space-y-2">
      <h2 className="font-ui text-3xl text-brand">Choose your donation</h2>
      <p className="font-body text-sm leading-relaxed text-brand/72">
        Pick a suggested amount or enter your own. SOAR accepts one-time gifts
        from {`£${MIN_DONATION}`} up to{" "}
        {`£${MAX_DONATION.toLocaleString("en-GB")}`}.
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      {DONATION_AMOUNTS.map((amount) => (
        <DonationChip
          key={amount}
          label={`£${amount}`}
          selected={amountChoice === String(amount)}
          onClick={() => {
            setAmountChoice(String(amount));
          }}
        />
      ))}
      <DonationChip
        label="Custom amount"
        selected={amountChoice === "custom"}
        onClick={() => setAmountChoice("custom")}
      />
    </div>

    {amountChoice === "custom" ? (
      <InputField
        label="Custom amount"
        name="donate-custom-amount"
        type="number"
        value={customAmount}
        onValueChange={setCustomAmount}
        placeholder="Enter an amount"
        autoComplete="off"
        min={MIN_DONATION}
        max={MAX_DONATION}
        step="1"
      />
    ) : null}

    <div className="rounded-3xl border border-brand/12 bg-page p-5">
      <p className="font-body text-sm text-brand/70">Current selection</p>
      <p className="mt-2 font-display text-4xl text-brand">{amountLabel}</p>
      <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
        {amountIsValid
          ? "This amount is ready to continue."
          : `Choose at least ${`£${MIN_DONATION}`} to continue.`}
      </p>
    </div>

    {!state.user ? (
      <div className="rounded-3xl border border-brand/12 bg-cream/70 p-5">
        <p className="font-ui text-sm tracking-[0.12em] text-brand/60">
          Optional details
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
          Leave an email if you want a receipt. You can donate without logging
          in.
        </p>
        <div className="mt-4">
          <InputField
            label="Email for receipt"
            name="donate-email"
            type="email"
            value={email}
            onValueChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            required={false}
          />
        </div>
      </div>
    ) : null}
  </section>
);

const PaymentStep = ({
  amountLabel,
  paymentMethod,
  setPaymentMethod,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  bankAccount,
  setBankAccount,
  bankSortCode,
  setBankSortCode,
  bitcoinWallet,
  setBitcoinWallet,
  billingPostcode,
  setBillingPostcode,
  processingStep,
  status,
}) => (
  <section className="space-y-6">
    <div className="space-y-2">
      <h2 className="font-ui text-3xl text-brand">Enter payment details</h2>
      <p className="font-body text-sm leading-relaxed text-brand/72">
        Your donation of {amountLabel} will be confirmed immediately after a
        valid payment format is entered.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      {PAYMENT_METHODS.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          selected={paymentMethod === method.id}
          onClick={() => setPaymentMethod(method.id)}
        />
      ))}
    </div>

    {paymentMethod === "card" ? (
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Cardholder name"
          name="card-name"
          value={cardName}
          onValueChange={setCardName}
          placeholder="Name on card"
          autoComplete="cc-name"
        />
        <InputField
          label="Card number"
          name="card-number"
          value={cardNumber}
          onValueChange={setCardNumber}
          placeholder="1234 5678 9012 3456"
          autoComplete="cc-number"
        />
        <InputField
          label="Expiry date"
          name="card-expiry"
          value={cardExpiry}
          onValueChange={setCardExpiry}
          placeholder="MM/YY"
          autoComplete="cc-exp"
        />
        <InputField
          label="CVC"
          name="card-cvc"
          value={cardCvc}
          onValueChange={setCardCvc}
          placeholder="123"
          autoComplete="cc-csc"
        />
      </div>
    ) : null}

    {paymentMethod === "google-pay" || paymentMethod === "apple-pay" ? (
      <div className="rounded-3xl border border-brand/12 bg-page p-5">
        <p className="font-ui text-lg text-brand">Fast checkout selected</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
          Enter the billing postcode below to complete the simulated wallet
          confirmation.
        </p>
      </div>
    ) : null}

    {paymentMethod === "paypal" ? (
      <div className="rounded-3xl border border-brand/12 bg-page p-5">
        <p className="font-ui text-lg text-brand">PayPal account</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
          Enter the email linked to your PayPal account in the billing field if
          you prefer to use PayPal.
        </p>
      </div>
    ) : null}

    {paymentMethod === "bank" ? (
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Account number"
          name="bank-account"
          value={bankAccount}
          onValueChange={setBankAccount}
          placeholder="12345678"
          autoComplete="off"
        />
        <InputField
          label="Sort code"
          name="bank-sort-code"
          value={bankSortCode}
          onValueChange={setBankSortCode}
          placeholder="12-34-56"
          autoComplete="off"
        />
      </div>
    ) : null}

    {paymentMethod === "bitcoin" ? (
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Bitcoin wallet address"
          name="bitcoin-wallet"
          value={bitcoinWallet}
          onValueChange={setBitcoinWallet}
          placeholder="bc1..."
          autoComplete="off"
        />
        <div className="rounded-3xl border border-brand/12 bg-page p-5">
          <p className="font-ui text-sm tracking-[0.12em] text-brand/60">
            Wallet transfer
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
            Bitcoin donations are accepted as a direct network transfer.
          </p>
        </div>
      </div>
    ) : null}

    <InputField
      label="Billing postcode"
      name="billing-postcode"
      value={billingPostcode}
      onValueChange={setBillingPostcode}
      placeholder="SW1A 1AA"
      autoComplete="postal-code"
    />

    <p className="font-body text-xs leading-relaxed text-brand/62">
      This checkout is simulated for product experience. If the format is valid,
      your donation will be marked successful immediately.
    </p>

    {status === "loading" ? (
      <div className="rounded-3xl border border-brand/12 bg-brand/5 p-5">
        <p className="font-ui text-lg text-brand">Processing transaction...</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand/10">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500"
            style={{ width: `${Math.max(15, processingStep * 25)}%` }}
          />
        </div>

        <ol className="mt-4 space-y-2">
          <ProcessingItem
            done={processingStep >= 1}
            label="Validating payment details"
          />
          <ProcessingItem
            done={processingStep >= 2}
            label="Authorizing transaction"
          />
          <ProcessingItem
            done={processingStep >= 3}
            label="Completing confirmation"
          />
          <ProcessingItem
            done={processingStep >= 4}
            label="Generating receipt"
          />
        </ol>
      </div>
    ) : null}
  </section>
);

const DonationChip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2 font-ui text-sm tracking-[0.08em] transition duration-200 hover:-translate-y-0.5 ${
      selected
        ? "bg-brand text-cream shadow-[0_8px_24px_rgba(75,81,149,0.2)]"
        : "border border-brand/15 bg-page text-brand hover:border-brand/30"
    }`}
  >
    {label}
  </button>
);

const PaymentMethodCard = ({ method, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-3xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 ${
      selected
        ? "border-brand bg-brand/5 shadow-[0_10px_30px_rgba(75,81,149,0.08)]"
        : "border-brand/12 bg-page hover:border-brand/25"
    }`}
  >
    <p className="font-ui text-base text-brand">{method.label}</p>
    <p className="mt-1 font-body text-xs text-brand/65">{method.description}</p>
  </button>
);

const StatCard = ({ label, value }) => (
  <div className="rounded-3xl border border-brand/12 bg-page p-4">
    <p className="font-body text-sm text-brand/70">{label}</p>
    <p className="mt-2 font-ui text-xl text-brand">{value}</p>
  </div>
);

const ImpactRow = ({ title, body }) => (
  <div className="rounded-2xl border border-brand/12 bg-white px-4 py-3">
    <p className="font-ui text-sm text-brand">{title}</p>
    <p className="mt-1 font-body text-sm leading-relaxed text-brand/72">
      {body}
    </p>
  </div>
);

const SecureBadge = ({ text }) => (
  <span className="rounded-full border border-brand/15 bg-page px-3 py-1 font-ui text-[0.68rem] tracking-[0.12em] text-brand/70">
    {text}
  </span>
);

const SummaryLine = ({ label, value, strong = false }) => (
  <div className="mt-2 flex items-center justify-between gap-3">
    <span className="font-body text-sm text-brand/70">{label}</span>
    <span
      className={`font-body text-sm ${strong ? "font-semibold text-brand" : "text-brand/75"}`}
    >
      {value}
    </span>
  </div>
);

const ProcessingItem = ({ done, label }) => (
  <li className="flex items-center gap-3">
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
        done ? "bg-sage/25 text-sage" : "bg-brand/10 text-brand/50"
      }`}
    >
      {done ? "✓" : "•"}
    </span>
    <span className="font-body text-sm text-brand/75">{label}</span>
  </li>
);

const InfoBullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.45em] h-1.5 w-1.5 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/76">
      {text}
    </span>
  </li>
);

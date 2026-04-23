import { useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import { useSOARState } from "../../hooks/useSOARState";
import { PAYMENT_METHODS } from "./constants";

const AMOUNTS = [5, 25, 50, 100];

export default function Donate() {
  const [state] = useSOARState();

  // Transaction State
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [status, setStatus] = useState("idle");
  const [receiptId, setReceiptId] = useState(null);

  // Form State
  const [email, setEmail] = useState(state.user?.email ?? "");
  const [name, setName] = useState(state.user?.fullName ?? "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [walletOrBank, setWalletOrBank] = useState("");

  // Error State
  const [errors, setErrors] = useState({});

  const finalAmount = isCustom ? Number(customAmount) || 0 : amount;

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (finalAmount < 1 || finalAmount > 5000) {
      newErrors.amount = "Amount must be between £1 and £5000.";
      isValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email.";
      isValid = false;
    }

    if (paymentMethod === "card") {
      if (!name.trim()) {
        newErrors.name = "Name is required.";
        isValid = false;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Enter a 16-digit number.";
        isValid = false;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
        newErrors.expiry = "Use MM/YY format.";
        isValid = false;
      }
      if (cvc.length < 3) {
        newErrors.cvc = "Invalid CVC.";
        isValid = false;
      }
    } else if (paymentMethod === "bank" || paymentMethod === "bitcoin") {
      if (walletOrBank.length < 5) {
        newErrors.walletOrBank = "Please enter valid details.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("processing");

    // Simulate instant PRO checkout
    setTimeout(() => {
      setReceiptId(`SOAR-${Date.now().toString().slice(-8)}`);
      setStatus("success");
    }, 800);
  };

  if (status === "success") {
    return (
      <SuccessView amount={finalAmount} receiptId={receiptId} email={email} />
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <header className="mb-12 max-w-2xl space-y-4">
        <h1 className="font-display text-[clamp(3rem,6vw,4.5rem)] leading-[0.92] text-brand">
          Fund the next iteration.
        </h1>
        <p className="font-body text-base leading-relaxed text-brand/80 md:text-lg">
          SOAR runs on peer support. Your contribution keeps the platform
          ad-free, sustains the decentralised network, and funds new features.
        </p>
      </header>

      <form
        onSubmit={handleCheckout}
        className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
      >
        {/* Left Column: Amount Selection */}
        <section className="space-y-8">
          <div>
            <h2 className="font-ui text-xl text-brand mb-4">
              1. Select Contribution
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {AMOUNTS.map((val) => (
                <Button
                  key={val}
                  type="button"
                  text={`£${val}`}
                  onClick={() => {
                    setIsCustom(false);
                    setAmount(val);
                    setErrors({ ...errors, amount: null });
                  }}
                  variant={!isCustom && amount === val ? "primary" : "ghost"}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`rounded-xl px-4 py-2 font-ui text-sm transition-all ${
                  isCustom
                    ? "bg-brand/10 text-brand"
                    : "text-brand/60 hover:text-brand"
                }`}
              >
                Custom Amount
              </button>
              {isCustom && (
                <div className="flex-1 min-w-50">
                  <InputField
                    name="custom-amount-val"
                    type="number"
                    placeholder="Minimum £1"
                    value={customAmount}
                    onValueChange={(val) => {
                      setCustomAmount(val);
                      setErrors({ ...errors, amount: null });
                    }}
                    error={errors.amount}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-brand/10 bg-brand/5 p-6">
            <h3 className="font-ui text-sm tracking-widest text-brand/60 uppercase">
              Impact Summary
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-brand/80">
              A contribution of <strong>£{finalAmount}</strong> goes directly
              into the Community Benefit Society treasury. It will be allocated
              democratically by peers in the next governance vote.
            </p>
          </div>
        </section>

        {/* Right Column: Payment Details */}
        <section className="space-y-6 rounded-4xl border border-brand/15 bg-page p-6 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-ui text-xl text-brand">2. Payment Method</h2>

            <div className="flex flex-wrap gap-2 mt-2">
              {PAYMENT_METHODS.map((method) => (
                <Button
                  key={method.id}
                  type="button"
                  text={method.label}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    setErrors({});
                  }}
                  fullWidth={false}
                  variant={paymentMethod === method.id ? "primary" : "ghost"}
                  className="text-sm"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <InputField
              label="Email Address for Receipt"
              name="chk-eml"
              type="email"
              value={email}
              onValueChange={setEmail}
              error={errors.email}
            />

            {paymentMethod === "card" && (
              <>
                <InputField
                  label="Name on Card"
                  name="chk-nm"
                  value={name}
                  onValueChange={setName}
                  error={errors.name}
                />
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                  <InputField
                    label="Card Number"
                    name="chk-num"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onValueChange={setCardNumber}
                    error={errors.cardNumber}
                  />
                  <div className="w-24">
                    <InputField
                      label="Expiry"
                      name="chk-exp"
                      placeholder="MM/YY"
                      value={expiry}
                      onValueChange={setExpiry}
                      error={errors.expiry}
                    />
                  </div>
                  <div className="w-24">
                    <InputField
                      label="CVC"
                      name="chk-sec"
                      placeholder="123"
                      value={cvc}
                      onValueChange={setCvc}
                      error={errors.cvc}
                    />
                  </div>
                </div>
              </>
            )}

            {(paymentMethod === "google-pay" ||
              paymentMethod === "apple-pay" ||
              paymentMethod === "paypal") && (
              <div className="rounded-2xl border border-brand/10 bg-brand/5 p-5 text-center">
                <p className="font-ui text-brand mb-1">
                  Fast Checkout Selected
                </p>
                <p className="font-body text-sm text-brand/60">
                  Clicking Pay will launch the provider's secure window.
                </p>
              </div>
            )}

            {(paymentMethod === "bank" || paymentMethod === "bitcoin") && (
              <InputField
                label={
                  paymentMethod === "bank"
                    ? "Account / Sort Code"
                    : "Wallet Address"
                }
                name="chk-misc"
                value={walletOrBank}
                onValueChange={setWalletOrBank}
                error={errors.walletOrBank}
              />
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              text={`Pay £${finalAmount}`}
              loadingText="Processing securely..."
              status={status === "processing" ? "loading" : "idle"}
              fullWidth={true}
            />
            <p className="mt-3 text-center font-body text-xs text-brand/50">
              Payments are processed securely via SSL.
            </p>
          </div>
        </section>
      </form>
    </main>
  );
}

const SuccessView = ({ amount, receiptId, email }) => (
  <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sage/20 text-sage">
      <svg
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 className="font-display text-5xl text-brand mb-4">
      Donation Successful
    </h1>
    <p className="font-body text-lg text-brand/80 max-w-xl">
      Thank you for your contribution of <strong>£{amount}</strong>. Your
      support ensures SOAR remains a community-owned, ad-free environment.
    </p>
    <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-brand/10 bg-page p-6 w-full max-w-sm">
      <span className="font-ui text-sm text-brand/50 uppercase tracking-widest">
        Receipt ID
      </span>
      <span className="font-ui text-lg text-brand">{receiptId}</span>
      {email && (
        <span className="font-body text-sm text-brand/60 mt-2">
          Sent to {email}
        </span>
      )}
    </div>
    <Link
      to="/dashboard"
      className="mt-10 font-ui text-sm text-navy underline hover:no-underline"
    >
      Return to Dashboard
    </Link>
  </main>
);

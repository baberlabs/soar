import { InputField } from "../../../components/InputField";
import { DonationChip } from "./DonationChip";
import { DONATION_AMOUNTS, MIN_DONATION, MAX_DONATION } from "../constants";

export const AmountStep = ({
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
          onClick={() => setAmountChoice(String(amount))}
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
          : `Choose at least £${MIN_DONATION} to continue.`}
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

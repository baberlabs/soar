import { InputField } from "../../../components/InputField";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { PAYMENT_METHODS } from "../constants";

export const PaymentStep = ({
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

const ProcessingItem = ({ done, label }) => (
  <li className="flex items-center gap-3">
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${done ? "bg-sage/25 text-sage" : "bg-brand/10 text-brand/50"}`}
    >
      {done ? "✓" : "•"}
    </span>
    <span className="font-body text-sm text-brand/75">{label}</span>
  </li>
);

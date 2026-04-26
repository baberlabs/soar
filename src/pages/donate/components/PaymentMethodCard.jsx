export const PaymentMethodCard = ({ method, selected, onClick }) => (
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

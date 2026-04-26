export const DonationChip = ({ label, selected, onClick }) => (
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

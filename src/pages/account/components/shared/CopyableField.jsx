import { useState } from "react";

/**
 * Small copy-to-clipboard helper used for IDs (CIDs, PeerIDs, multiaddrs).
 *
 * Matches the pattern used by web3.storage, Pinata, and IPFS Desktop:
 * monospace value, click anywhere on the chip to copy, short ack toast
 * (inline, not a global notification).
 */
export const CopyableField = ({ value, label, displayValue, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Silently fail — the clipboard API isn't available in every context.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ? `Copy ${label}` : "Copy value"}
      className={`group inline-flex max-w-full items-center gap-2 rounded-xl border border-brand/12 bg-page/60 px-3 py-1.5 font-mono text-xs text-brand/75 transition hover:border-brand/30 hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 ${className}`}
    >
      <span className="truncate">{displayValue ?? value}</span>
      <span
        aria-hidden="true"
        className="shrink-0 text-[0.65rem] uppercase tracking-[0.12em] text-brand/45 transition group-hover:text-brand"
      >
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
};

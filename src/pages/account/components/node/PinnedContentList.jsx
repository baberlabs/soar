import { useState } from "react";
import { CopyableField } from "../shared/CopyableField";
import { formatBytes } from "../../utils/nodeStats";
import { shortenId } from "../../utils/ipfs";

/**
 * List of pinned content on the node. Each row shows a CID, a human label,
 * the category, and the byte size.
 *
 * Filter pills across the top let the user narrow by category. CIDs are
 * copyable — matches the pattern used by Pinata and Web3.Storage.
 */
export const PinnedContentList = ({ pins = [] }) => {
  const [filter, setFilter] = useState("all");

  const categories = ["all", ...new Set(pins.map((pin) => pin.category))];
  const filtered =
    filter === "all" ? pins : pins.filter((pin) => pin.category === filter);

  if (pins.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand/25 bg-page/60 p-8 text-center">
        <p className="font-ui text-base text-brand">Nothing pinned yet</p>
        <p className="mt-1.5 font-body text-sm text-brand/60">
          Content you create, reflect on, or save will be pinned to your node.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={`rounded-full border px-3 py-1 font-body text-xs transition duration-150 ${
              filter === category
                ? "border-brand bg-brand text-cream shadow-[0_6px_14px_rgba(75,81,149,0.18)]"
                : "border-brand/20 bg-cream text-brand/70 hover:border-brand/40 hover:bg-brand/5"
            }`}
          >
            {category === "all" ? "All" : category}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-brand/10 overflow-hidden rounded-2xl border border-brand/12 bg-page/40">
        {filtered.map((pin) => (
          <li
            key={pin.key}
            className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)_auto] md:items-center"
          >
            <div className="min-w-0">
              <p className="truncate font-ui text-sm text-brand">{pin.label}</p>
              <p className="mt-0.5 font-body text-[0.65rem] uppercase tracking-[0.12em] text-brand/50">
                {pin.category}
              </p>
            </div>
            <div className="min-w-0">
              <CopyableField
                value={pin.cid}
                label="content ID"
                displayValue={shortenId(pin.cid, 12, 8)}
                className="w-full"
              />
            </div>
            <p className="font-body text-xs tabular-nums text-brand/65 md:text-right">
              {formatBytes(pin.size)}
            </p>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="pt-2 font-body text-sm text-brand/60">
          No items in this category.
        </p>
      ) : null}
    </div>
  );
};

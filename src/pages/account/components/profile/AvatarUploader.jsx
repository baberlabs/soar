import { useRef, useState } from "react";
import { Avatar } from "../shared/Avatar";
import { fileToAvatarDataURL } from "../../utils/avatar";

/**
 * Click the avatar → file picker. Shows a live preview on hover.
 * "Remove" clears back to the initials fallback.
 *
 * Errors render inline (oversize file, wrong type) next to the avatar.
 * Matches the modern pattern: no separate "Upload picture" button, the
 * avatar itself is the control.
 */
export const AvatarUploader = ({ user, onChange }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handlePick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-picking the same file
    if (!file) return;

    try {
      const dataUrl = await fileToAvatarDataURL(file);
      setError("");
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "Couldn't read that image");
    }
  };

  const openPicker = () => fileInputRef.current?.click();

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={openPicker}
        className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        aria-label="Change avatar"
      >
        <Avatar user={user} size="xl" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-navy/45 font-ui text-[0.62rem] uppercase tracking-[0.14em] text-cream opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          Change
        </span>
      </button>

      <div className="space-y-1.5">
        <p className="font-ui text-sm tracking-[0.04em] text-brand">
          Profile picture
        </p>
        <p className="max-w-xs font-body text-xs text-brand/60">
          Click the avatar to upload. JPG, PNG, or GIF up to 2 MB.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={openPicker}
            className="rounded-full border border-brand/20 px-3 py-1 font-ui text-xs tracking-[0.06em] text-brand transition hover:border-brand/35"
          >
            Upload
          </button>
          {user?.avatarImage ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-full border border-transparent px-3 py-1 font-ui text-xs tracking-[0.06em] text-brand/60 transition hover:text-brand"
            >
              Remove
            </button>
          ) : null}
        </div>
        {error ? (
          <p role="alert" className="mt-1 font-body text-xs text-rose-700">
            {error}
          </p>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePick}
        className="hidden"
      />
    </div>
  );
};

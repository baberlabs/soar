import { getAvatarTint, getInitials } from "../../utils/avatar";

const SIZES = {
  sm: { box: "h-9 w-9", text: "text-sm" },
  md: { box: "h-12 w-12", text: "text-base" },
  lg: { box: "h-16 w-16", text: "text-xl" },
  xl: { box: "h-20 w-20 md:h-24 md:w-24", text: "text-2xl md:text-3xl" },
};

/**
 * Avatar for the current user. Falls back to tinted initials when no
 * image is uploaded. Tint is deterministic per user ID so each user
 * keeps a consistent colour even without a photo.
 */
export const Avatar = ({ user, size = "md", className = "" }) => {
  const { box, text } = SIZES[size] ?? SIZES.md;

  if (user?.avatarImage) {
    return (
      <img
        src={user.avatarImage}
        alt={`${user.fullName || "Peer"} avatar`}
        className={`${box} ${className} shrink-0 rounded-full border border-brand/18 object-cover`}
      />
    );
  }

  const tint = getAvatarTint(user?.id);
  const initials = getInitials(user?.fullName);

  return (
    <div
      aria-hidden="true"
      className={`${box} ${tint.bg} ${className} flex shrink-0 items-center justify-center rounded-full border border-brand/18`}
    >
      <span className={`${text} ${tint.text} font-ui tracking-wider`}>
        {initials}
      </span>
    </div>
  );
};

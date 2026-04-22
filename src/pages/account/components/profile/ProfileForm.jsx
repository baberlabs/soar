import { InputField } from "../../../../components/InputField";
import { Button } from "../../../../components/Button";
import { AvatarUploader } from "./AvatarUploader";

/**
 * The main profile form. Fields are grouped but all live inside one form
 * with one Save button — standard settings-page rhythm.
 *
 * The Save button's label reflects the status state from useProfileForm:
 *   idle    → "Save changes"
 *   saving  → "Saving..."
 *   saved   → "Saved ✓"
 *   error   → "Save changes"  (with error message below)
 */
export const ProfileForm = ({
  user,
  fields,
  status,
  error,
  onFieldChange,
  onLinkChange,
  onAvatarChange,
  onSubmit,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const saveLabel =
    status === "saving"
      ? "Saving..."
      : status === "saved"
        ? "Saved ✓"
        : "Save changes";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUploader user={user} onChange={onAvatarChange} />

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Full name"
          type="text"
          name="profile-full-name"
          placeholder="Your full name"
          value={fields.fullName}
          onValueChange={(value) => onFieldChange("fullName", value)}
        />
        <InputField
          label="Email"
          type="email"
          name="profile-email"
          placeholder="you@example.com"
          value={fields.email}
          onValueChange={(value) => onFieldChange("email", value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="profile-bio"
          className="font-body text-sm text-brand/70"
        >
          Bio
        </label>
        <textarea
          id="profile-bio"
          value={fields.bio}
          onChange={(event) => onFieldChange("bio", event.target.value)}
          placeholder="A sentence or two about what you're working on."
          rows="3"
          className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Location"
          type="text"
          name="profile-location"
          placeholder="City, country"
          value={fields.location}
          onValueChange={(value) => onFieldChange("location", value)}
          required={false}
        />
        <InputField
          label="Timezone"
          type="text"
          name="profile-timezone"
          placeholder="e.g. Europe/London"
          value={fields.timezone}
          onValueChange={(value) => onFieldChange("timezone", value)}
          required={false}
        />
      </div>

      <fieldset className="grid gap-4 md:grid-cols-3">
        <legend className="col-span-full font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
          Links
        </legend>
        <InputField
          label="Website"
          type="text"
          name="profile-website"
          placeholder="https://"
          value={fields.links.website}
          onValueChange={(value) => onLinkChange("website", value)}
          required={false}
        />
        <InputField
          label="GitHub"
          type="text"
          name="profile-github"
          placeholder="username"
          value={fields.links.github}
          onValueChange={(value) => onLinkChange("github", value)}
          required={false}
        />
        <InputField
          label="LinkedIn"
          type="text"
          name="profile-linkedin"
          placeholder="/in/username"
          value={fields.links.linkedin}
          onValueChange={(value) => onLinkChange("linkedin", value)}
          required={false}
        />
      </fieldset>

      <div className="flex items-center gap-4 border-t border-brand/10 pt-5">
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth={false}
          text={saveLabel}
          disabled={status === "saving"}
        />
        {error ? (
          <p role="alert" className="font-body text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
};

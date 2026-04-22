import { useCallback } from "react";
import { useSOARState } from "../../../hooks/useSOARState";
import { SectionCard } from "../components/shared/SectionCard";
import { ProfileForm } from "../components/profile/ProfileForm";
import { InterestsEditor } from "../components/profile/InterestsEditor";
import { useProfileForm } from "../hooks/useProfileForm";

/**
 * Profile tab. Two sections:
 *   1. Identity + contact + avatar + bio + location + links (one form)
 *   2. Interests (live-saved; no explicit save button)
 *
 * Interests flush immediately on toggle because they're small and users
 * expect chip toggles to feel instant. Form fields batch into one Save.
 */
export default function ProfileTab() {
  const [state, dispatch] = useSOARState();
  const user = state.user;

  const saveProfile = useCallback(
    (patch) => dispatch({ type: "UPDATE_USER", payload: patch }),
    [dispatch],
  );

  const { fields, status, error, setField, setLink, submit } = useProfileForm({
    user,
    onSave: saveProfile,
  });

  const onAvatarChange = (dataUrl) =>
    dispatch({ type: "UPDATE_USER", payload: { avatarImage: dataUrl } });

  const onInterestsChange = (next) =>
    dispatch({ type: "UPDATE_USER", payload: { interests: next } });

  return (
    <section
      id="account-panel-profile"
      role="tabpanel"
      aria-labelledby="account-tab-profile"
      className="space-y-6"
    >
      <SectionCard
        title="Profile"
        description="This is how you appear to other peers on SOAR."
      >
        <ProfileForm
          user={user}
          fields={fields}
          status={status}
          error={error}
          onFieldChange={setField}
          onLinkChange={setLink}
          onAvatarChange={onAvatarChange}
          onSubmit={submit}
        />
      </SectionCard>

      <SectionCard
        title="Interests"
        description="Used to recommend peers, events, and pathways."
      >
        <InterestsEditor
          interests={user.interests ?? []}
          onChange={onInterestsChange}
        />
      </SectionCard>
    </section>
  );
}

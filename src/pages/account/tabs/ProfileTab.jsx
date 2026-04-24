import { useCallback } from "react";
import { useSOARDispatch, useSOARState } from "../../../store";
import { SectionCard } from "../components/shared/SectionCard";
import { ProfileForm } from "../components/profile/ProfileForm";
import { InterestsEditor } from "../components/profile/InterestsEditor";
import { useProfileForm } from "../hooks/useProfileForm";

export default function ProfileTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
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

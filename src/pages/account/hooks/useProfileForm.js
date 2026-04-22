import { useCallback, useEffect, useReducer } from "react";

/**
 * Reducer-backed profile form. Holds a dirty copy of profile fields so the
 * user can edit freely, then flushes to the store on submit.
 *
 * Saves via onSave(patch) — the parent wires that to dispatch(UPDATE_USER).
 * `status` drives the button label state ("Save" / "Saving..." / "Saved ✓").
 */

const initialFormState = (user) => ({
  fullName: user?.fullName ?? "",
  email: user?.email ?? "",
  bio: user?.bio ?? "",
  location: user?.location ?? "",
  timezone: user?.timezone ?? "",
  links: {
    website: user?.links?.website ?? "",
    github: user?.links?.github ?? "",
    linkedin: user?.links?.linkedin ?? "",
  },
  status: "idle", // idle | saving | saved | error
  error: "",
});

const reducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE":
      // Only hydrate if status is idle — don't clobber an in-flight edit.
      return state.status === "idle" ? initialFormState(action.user) : state;

    case "FIELD":
      return {
        ...state,
        [action.key]: action.value,
        status: "idle",
        error: "",
      };

    case "LINK":
      return {
        ...state,
        links: { ...state.links, [action.key]: action.value },
        status: "idle",
        error: "",
      };

    case "SAVING":
      return { ...state, status: "saving", error: "" };

    case "SAVED":
      return { ...state, status: "saved", error: "" };

    case "ERROR":
      return { ...state, status: "error", error: action.message };

    case "RESET_STATUS":
      return { ...state, status: "idle" };

    default:
      return state;
  }
};

export const useProfileForm = ({ user, onSave }) => {
  const [state, dispatch] = useReducer(reducer, user, initialFormState);

  // Re-hydrate if the source user changes (e.g. tab-switch and back) AND
  // the form is idle. Avoids stomping on unsaved edits.
  useEffect(() => {
    dispatch({ type: "HYDRATE", user });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-clear the "Saved" success state after a moment so the button
  // returns to its neutral state for the next edit.
  useEffect(() => {
    if (state.status !== "saved") return undefined;
    const timer = setTimeout(() => dispatch({ type: "RESET_STATUS" }), 1600);
    return () => clearTimeout(timer);
  }, [state.status]);

  const setField = useCallback(
    (key, value) => dispatch({ type: "FIELD", key, value }),
    [],
  );

  const setLink = useCallback(
    (key, value) => dispatch({ type: "LINK", key, value }),
    [],
  );

  const submit = useCallback(async () => {
    // Validate basic required fields — name + email.
    if (!state.fullName.trim()) {
      dispatch({ type: "ERROR", message: "Name can't be empty" });
      return;
    }
    if (!state.email.trim()) {
      dispatch({ type: "ERROR", message: "Email can't be empty" });
      return;
    }

    dispatch({ type: "SAVING" });

    try {
      // Simulated latency so the "Saving..." microstate is perceptible.
      // Short enough to not feel artificial.
      await new Promise((resolve) => setTimeout(resolve, 320));

      onSave({
        fullName: state.fullName.trim(),
        email: state.email.trim(),
        bio: state.bio.trim(),
        location: state.location.trim(),
        timezone: state.timezone.trim(),
        links: {
          website: state.links.website.trim(),
          github: state.links.github.trim(),
          linkedin: state.links.linkedin.trim(),
        },
      });

      dispatch({ type: "SAVED" });
    } catch (error) {
      dispatch({ type: "ERROR", message: error.message || "Save failed" });
    }
  }, [state, onSave]);

  return {
    fields: {
      fullName: state.fullName,
      email: state.email,
      bio: state.bio,
      location: state.location,
      timezone: state.timezone,
      links: state.links,
    },
    status: state.status,
    error: state.error,
    setField,
    setLink,
    submit,
  };
};

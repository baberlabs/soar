import { useCallback, useEffect, useReducer, useRef } from "react";

const initialState = {
  form: {
    targetDate: "",
    learningNotes: "",
  },
  status: "idle",
};

const enrollmentReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value,
        },
      };
    case "SET_STATUS":
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
};

export const useEnrollment = ({ subject, dispatch, user }) => {
  const [state, send] = useReducer(enrollmentReducer, initialState);
  const resetStatusTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (resetStatusTimeoutRef.current) {
        clearTimeout(resetStatusTimeoutRef.current);
      }
    },
    [],
  );

  const setStatus = useCallback((status) => {
    send({ type: "SET_STATUS", status });
  }, []);

  const setField = useCallback((field, value) => {
    send({ type: "SET_FIELD", field, value });
  }, []);

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!subject) return false;

      if (resetStatusTimeoutRef.current) {
        clearTimeout(resetStatusTimeoutRef.current);
      }

      setStatus("loading");

      dispatch({
        type: "ADD_CURRICULUM_SUBJECT",
        payload: {
          subjectId: subject.id,
          targetDate: state.form.targetDate,
          learningNotes: state.form.learningNotes,
          learningStyle: user?.learningStyle ?? "general",
        },
      });

      setStatus("success");
      resetStatusTimeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, 600);

      return true;
    },
    [
      dispatch,
      setStatus,
      state.form.learningNotes,
      state.form.targetDate,
      subject,
      user?.learningStyle,
    ],
  );

  return {
    form: state.form,
    setField,
    submit,
    status: state.status,
  };
};

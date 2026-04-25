import { useCallback, useMemo, useReducer } from "react";
import { LETTER_STATUS } from "../constants";
import { createId } from "../utils/ids";
import { getNextMonthValue } from "../utils/month";
import { buildLetterList } from "../utils/letters";

const emptyLetterForm = () => ({
  activeLetterId: null,
  targetMonth: getNextMonthValue(),
  letter: "",
});

const emptyReviewForm = () => ({
  letterId: null,
  whatHappened: "",
  whatChanged: "",
  carryForward: "",
});

const initialState = {
  letter: emptyLetterForm(),
  review: emptyReviewForm(),
  letterError: "",
  reviewError: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LETTER_FIELD":
      return {
        ...state,
        letter: {
          ...state.letter,
          [action.payload.field]: action.payload.value,
        },
        letterError: "",
      };

    case "LOAD_LETTER":
      return {
        ...state,
        letter: {
          activeLetterId: action.payload.id,
          targetMonth: action.payload.targetMonth,
          letter:
            action.payload.noteToSelf ||
            action.payload.intention.feelings ||
            "",
        },
        letterError: "",
      };

    case "RESET_LETTER":
      return { ...state, letter: emptyLetterForm(), letterError: "" };

    case "SET_LETTER_ERROR":
      return { ...state, letterError: action.payload };

    case "CLEAR_LETTER_ERROR":
      return { ...state, letterError: "" };

    case "SET_REVIEW_FIELD":
      return {
        ...state,
        review: {
          ...state.review,
          [action.payload.field]: action.payload.value,
        },
        reviewError: "",
      };

    case "LOAD_REVIEW":
      return {
        ...state,
        review: {
          letterId: action.payload.letterId,
          whatHappened: action.payload.review?.whatHappened ?? "",
          whatChanged: action.payload.review?.whatChanged ?? "",
          carryForward: action.payload.review?.carryForward ?? "",
        },
        reviewError: "",
      };

    case "RESET_REVIEW":
      return { ...state, review: emptyReviewForm(), reviewError: "" };

    case "SET_REVIEW_ERROR":
      return { ...state, reviewError: action.payload };

    case "CLEAR_REVIEW_ERROR":
      return { ...state, reviewError: "" };

    default:
      return state;
  }
};

export const useLetterComposer = ({ rawLetters, dispatchStore }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // -- Derived: fully processed letter list (migration + viewmodel + sort).
  const letters = useMemo(() => buildLetterList(rawLetters), [rawLetters]);
  const rawLetterIds = useMemo(
    () => rawLetters.map((letter) => letter.id).filter(Boolean),
    [rawLetters],
  );
  const activeLetterIds = useMemo(
    () =>
      rawLetters
        .filter((letter) => letter.status !== LETTER_STATUS.ARCHIVED)
        .map((letter) => letter.id)
        .filter(Boolean),
    [rawLetters],
  );
  const latestActiveLetterId = useMemo(
    () =>
      letters.find((letter) => letter.status !== LETTER_STATUS.ARCHIVED)?.id ??
      null,
    [letters],
  );

  // -- Letter form actions.
  const setLetterField = useCallback(
    (field, value) =>
      dispatch({ type: "SET_LETTER_FIELD", payload: { field, value } }),
    [],
  );

  const loadLetter = useCallback(
    (letter) => dispatch({ type: "LOAD_LETTER", payload: letter }),
    [],
  );

  const resetLetter = useCallback(() => dispatch({ type: "RESET_LETTER" }), []);
  const clearLetterError = useCallback(
    () => dispatch({ type: "CLEAR_LETTER_ERROR" }),
    [],
  );

  const validateLetter = () => {
    if (!state.letter.letter.trim()) {
      dispatch({
        type: "SET_LETTER_ERROR",
        payload: "Write your letter before saving.",
      });
      return false;
    }
    return true;
  };

  const buildLetterPayload = (letterId) => ({
    id: letterId,
    targetMonth: state.letter.targetMonth,
    intention: {
      feelings: "",
      threeActions: "",
      challengePlan: "",
      affirmation: "",
    },
    noteToSelf: state.letter.letter.trim(),
    ...(state.letter.activeLetterId
      ? {}
      : { createdAt: new Date().toISOString() }),
  });

  const getCurrentLetterId = () =>
    state.letter.activeLetterId || latestActiveLetterId || createId("lt");

  const pruneToSingleLetter = useCallback(
    (keepId) => {
      activeLetterIds.forEach((id) => {
        if (id !== keepId) {
          dispatchStore({ type: "REMOVE_MONTHLY_LETTER", payload: id });
        }
      });
    },
    [dispatchStore, activeLetterIds],
  );

  const saveDraft = useCallback(() => {
    if (!validateLetter()) return;

    const letterId = getCurrentLetterId();

    const payload = {
      ...buildLetterPayload(letterId),
      status: LETTER_STATUS.DRAFT,
    };
    dispatchStore({ type: "UPSERT_MONTHLY_LETTER", payload });
    pruneToSingleLetter(letterId);
    dispatch({
      type: "SET_LETTER_FIELD",
      payload: { field: "activeLetterId", value: letterId },
    });
  }, [state.letter, latestActiveLetterId, dispatchStore, pruneToSingleLetter]);

  const seal = useCallback(() => {
    if (!validateLetter()) return;

    const letterId = getCurrentLetterId();

    // Keep the seal as a single, atomic user intent.
    dispatchStore({
      type: "UPSERT_MONTHLY_LETTER",
      payload: { ...buildLetterPayload(letterId), status: LETTER_STATUS.DRAFT },
    });
    dispatchStore({ type: "SEAL_MONTHLY_LETTER", payload: letterId });
    pruneToSingleLetter(letterId);

    dispatch({ type: "RESET_LETTER" });
  }, [state.letter, latestActiveLetterId, dispatchStore, pruneToSingleLetter]);

  const deleteLetter = useCallback(
    (id) => {
      dispatchStore({ type: "REMOVE_MONTHLY_LETTER", payload: id });
      if (state.letter.activeLetterId === id)
        dispatch({ type: "RESET_LETTER" });
      if (state.review.letterId === id) dispatch({ type: "RESET_REVIEW" });
    },
    [dispatchStore, state.letter.activeLetterId, state.review.letterId],
  );

  const breakSeal = useCallback(
    (id) => {
      // Mark the seal broken AND mark the letter as opened so it appears unlocked.
      // Store should preserve `sealBroken: true` for honest review later.
      dispatchStore({
        type: "UPSERT_MONTHLY_LETTER",
        payload: { id, sealBroken: true },
      });
      dispatchStore({ type: "MARK_MONTHLY_LETTER_OPENED", payload: id });
    },
    [dispatchStore],
  );

  const archiveLetter = useCallback(
    (letter) => {
      if (!letter || letter.effectiveStatus !== LETTER_STATUS.REVIEWED) {
        dispatch({
          type: "SET_REVIEW_ERROR",
          payload: "Add your reflection before archiving this letter.",
        });
        return;
      }

      const id = letter.id;
      dispatchStore({
        type: "UPSERT_MONTHLY_LETTER",
        payload: {
          id,
          status: LETTER_STATUS.ARCHIVED,
          archivedAt: new Date().toISOString(),
        },
      });

      if (state.letter.activeLetterId === id) {
        dispatch({ type: "RESET_LETTER" });
      }
      if (state.review.letterId === id) {
        dispatch({ type: "RESET_REVIEW" });
      }
    },
    [dispatchStore, state.letter.activeLetterId, state.review.letterId],
  );

  // -- Review form actions.
  const setReviewField = useCallback(
    (field, value) =>
      dispatch({ type: "SET_REVIEW_FIELD", payload: { field, value } }),
    [],
  );

  const beginReview = useCallback(
    (letter) =>
      dispatch({
        type: "LOAD_REVIEW",
        payload: { letterId: letter.id, review: letter.review },
      }),
    [],
  );

  const cancelReview = useCallback(
    () => dispatch({ type: "RESET_REVIEW" }),
    [],
  );
  const clearReviewError = useCallback(
    () => dispatch({ type: "CLEAR_REVIEW_ERROR" }),
    [],
  );

  const saveReview = useCallback(() => {
    if (!state.review.letterId) return;

    if (
      !state.review.whatHappened.trim() ||
      !state.review.whatChanged.trim() ||
      !state.review.carryForward.trim()
    ) {
      dispatch({
        type: "SET_REVIEW_ERROR",
        payload: "Please answer all three review questions.",
      });
      return;
    }

    dispatchStore({
      type: "MARK_MONTHLY_LETTER_REVIEWED",
      payload: {
        id: state.review.letterId,
        review: {
          whatHappened: state.review.whatHappened.trim(),
          whatChanged: state.review.whatChanged.trim(),
          carryForward: state.review.carryForward.trim(),
        },
      },
    });
    dispatch({ type: "RESET_REVIEW" });
  }, [state.review, dispatchStore]);

  return {
    // state
    letterForm: state.letter,
    reviewForm: state.review,
    letterError: state.letterError,
    reviewError: state.reviewError,
    // derived
    letters,
    // letter actions
    setLetterField,
    loadLetter,
    resetLetter,
    clearLetterError,
    saveDraft,
    seal,
    deleteLetter,
    breakSeal,
    archiveLetter,
    // review actions
    setReviewField,
    beginReview,
    cancelReview,
    clearReviewError,
    saveReview,
  };
};

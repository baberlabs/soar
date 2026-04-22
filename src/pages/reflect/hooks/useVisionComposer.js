import { useCallback, useMemo, useReducer } from "react";
import { VISION_MODES } from "../constants";
import { createId } from "../utils/ids";
import {
  formatMonthLabel,
  generateMonthOptions,
  getCurrentMonthValue,
  toMonthInputValue,
} from "../utils/month";
import {
  getBoardMonthValue,
  getDefaultMoodboardPosition,
  getMaxZ,
  hydrateBoardItems,
} from "../utils/moodboard";

/**
 * Vision composer state model:
 *   { mode: { kind: 'view' },
 *     activeBoardId: string | null,
 *     form: null }
 *
 *   { mode: { kind: 'create', draftId, returnToBoardId },
 *     activeBoardId: draftId,
 *     form: { prompt, month, playlistNote, items, editingItemId } }
 *
 *   { mode: { kind: 'edit', boardId, returnToBoardId },
 *     activeBoardId: boardId,
 *     form: { ...same shape... } }
 */

const emptyForm = (month = getCurrentMonthValue()) => ({
  prompt: "",
  month,
  playlistNote: "",
  items: [],
  editingItemId: null,
});

const initialState = {
  mode: { kind: VISION_MODES.VIEW },
  activeBoardId: null,
  form: null,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_BOARD":
      if (state.mode.kind !== VISION_MODES.VIEW) return state;
      return { ...state, activeBoardId: action.payload };

    case "BEGIN_CREATE": {
      const draftId = createId("vb_draft");
      return {
        mode: {
          kind: VISION_MODES.CREATE,
          draftId,
          returnToBoardId: state.activeBoardId,
        },
        activeBoardId: draftId,
        form: emptyForm(action.payload?.month),
        error: "",
      };
    }

    case "BEGIN_EDIT": {
      const { board } = action.payload;
      return {
        mode: {
          kind: VISION_MODES.EDIT,
          boardId: board.id,
          returnToBoardId: state.activeBoardId,
        },
        activeBoardId: board.id,
        form: {
          prompt: board.prompt || "",
          month: toMonthInputValue(board.month, board.createdAt),
          playlistNote: board.playlistNote || "",
          items: hydrateBoardItems(board.items || []),
          editingItemId: null,
        },
        error: "",
      };
    }

    case "CANCEL": {
      const restoreBoardId =
        state.mode.kind !== VISION_MODES.VIEW
          ? state.mode.returnToBoardId
          : state.activeBoardId;
      return {
        mode: { kind: VISION_MODES.VIEW },
        activeBoardId: restoreBoardId,
        form: null,
        error: "",
      };
    }

    case "SAVE_SUCCESS":
      return {
        mode: { kind: VISION_MODES.VIEW },
        activeBoardId: action.payload.boardId,
        form: null,
        error: "",
      };

    case "SAVE_SUCCESS_STAY_EDITING": {
      if (!state.form) return state;

      const returnToBoardId =
        state.mode.kind === VISION_MODES.CREATE ||
        state.mode.kind === VISION_MODES.EDIT
          ? state.mode.returnToBoardId
          : state.activeBoardId;

      return {
        ...state,
        mode: {
          kind: VISION_MODES.EDIT,
          boardId: action.payload.boardId,
          returnToBoardId,
        },
        activeBoardId: action.payload.boardId,
        form: state.form,
        error: "",
      };
    }

    case "SET_FORM_FIELD":
      if (!state.form) return state;
      return {
        ...state,
        form: { ...state.form, [action.payload.field]: action.payload.value },
        error: "",
      };

    case "ADD_ITEM":
      if (!state.form) return state;
      return {
        ...state,
        form: {
          ...state.form,
          items: [...state.form.items, action.payload],
          editingItemId: null,
        },
        error: "",
      };

    case "UPDATE_ITEM":
      if (!state.form) return state;
      return {
        ...state,
        form: {
          ...state.form,
          items: state.form.items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  ...action.payload.patch,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        },
      };

    case "REMOVE_ITEM":
      if (!state.form) return state;
      return {
        ...state,
        form: {
          ...state.form,
          items: state.form.items.filter((item) => item.id !== action.payload),
          editingItemId:
            state.form.editingItemId === action.payload
              ? null
              : state.form.editingItemId,
        },
      };

    case "BEGIN_EDIT_ITEM":
      if (!state.form) return state;
      return {
        ...state,
        form: { ...state.form, editingItemId: action.payload },
      };

    case "CANCEL_EDIT_ITEM":
      if (!state.form) return state;
      return {
        ...state,
        form: { ...state.form, editingItemId: null },
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: "" };

    default:
      return state;
  }
};

export const useVisionComposer = ({ visionBoards, dispatchStore }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getPreferredCreateMonth = useCallback((usedMonths) => {
    const currentMonth = getCurrentMonthValue();
    if (!usedMonths.has(currentMonth)) {
      return currentMonth;
    }

    const options = generateMonthOptions();
    const currentIndex = options.findIndex(
      (option) => option.value === currentMonth,
    );

    // Prefer the nearest future free month first.
    if (currentIndex >= 0) {
      const nextFree = options
        .slice(currentIndex + 1)
        .find((option) => !usedMonths.has(option.value));
      if (nextFree) return nextFree.value;

      const previousFree = options
        .slice(0, currentIndex)
        .reverse()
        .find((option) => !usedMonths.has(option.value));
      if (previousFree) return previousFree.value;
    }

    const anyFree = options.find((option) => !usedMonths.has(option.value));
    return anyFree?.value ?? currentMonth;
  }, []);

  // -- Derived: sorted boards (memoized on visionBoards reference).
  const sortedBoards = useMemo(
    () =>
      visionBoards.slice().sort((left, right) => {
        const leftMonth = getBoardMonthValue(left);
        const rightMonth = getBoardMonthValue(right);
        if (leftMonth !== rightMonth)
          return leftMonth.localeCompare(rightMonth);
        return new Date(left.createdAt ?? 0) - new Date(right.createdAt ?? 0);
      }),
    [visionBoards],
  );

  const currentMonthValue = useMemo(getCurrentMonthValue, []);

  const currentMonthBoard = useMemo(
    () =>
      sortedBoards.find(
        (board) => getBoardMonthValue(board) === currentMonthValue,
      ) ?? null,
    [sortedBoards, currentMonthValue],
  );

  const selectedBoard = useMemo(() => {
    if (!state.activeBoardId) {
      return currentMonthBoard ?? sortedBoards[0] ?? null;
    }
    return (
      sortedBoards.find((board) => board.id === state.activeBoardId) ??
      currentMonthBoard ??
      sortedBoards[0] ??
      null
    );
  }, [state.activeBoardId, currentMonthBoard, sortedBoards]);

  // -- Derived: the "working" board shown in the stage.
  const workingBoard = useMemo(() => {
    if (state.mode.kind === VISION_MODES.CREATE && state.form) {
      const monthLabel = formatMonthLabel(state.form.month);
      return {
        id: state.mode.draftId,
        title: monthLabel,
        month: state.form.month,
        prompt: state.form.prompt,
        playlistNote: state.form.playlistNote,
        items: state.form.items,
        isDraft: true,
      };
    }

    if (state.mode.kind === VISION_MODES.EDIT && state.form) {
      const monthLabel = formatMonthLabel(state.form.month);
      return {
        id: state.mode.boardId,
        title: monthLabel,
        month: state.form.month,
        prompt: state.form.prompt,
        playlistNote: state.form.playlistNote,
        items: state.form.items,
        isDraft: false,
      };
    }

    return selectedBoard;
  }, [state.mode, state.form, selectedBoard]);

  // -- Derived: carousel list includes the current draft during create mode.
  const carouselBoards = useMemo(() => {
    if (state.mode.kind !== VISION_MODES.CREATE || !state.form) {
      return sortedBoards;
    }
    return [
      {
        id: state.mode.draftId,
        title: formatMonthLabel(state.form.month),
        month: state.form.month,
        prompt: state.form.prompt,
        playlistNote: state.form.playlistNote,
        items: state.form.items,
        isDraft: true,
      },
      ...sortedBoards,
    ];
  }, [state.mode, state.form, sortedBoards]);

  const blockedMonthValues = useMemo(() => {
    const currentBoardId =
      state.mode.kind === VISION_MODES.EDIT ? state.mode.boardId : null;

    return sortedBoards
      .filter((board) => board.id !== currentBoardId)
      .map((board) => getBoardMonthValue(board));
  }, [sortedBoards, state.mode]);

  // -- Actions (stable references via useCallback).
  const selectBoard = useCallback(
    (id) => dispatch({ type: "SELECT_BOARD", payload: id }),
    [],
  );

  const beginCreate = useCallback(() => {
    const usedMonths = new Set(
      sortedBoards.map((board) => getBoardMonthValue(board)),
    );
    dispatch({
      type: "BEGIN_CREATE",
      payload: { month: getPreferredCreateMonth(usedMonths) },
    });
  }, [sortedBoards, getPreferredCreateMonth]);

  const beginEdit = useCallback(
    (board) => dispatch({ type: "BEGIN_EDIT", payload: { board } }),
    [],
  );

  const cancel = useCallback(() => dispatch({ type: "CANCEL" }), []);

  const setFormField = useCallback(
    (field, value) =>
      dispatch({ type: "SET_FORM_FIELD", payload: { field, value } }),
    [],
  );

  const addItem = useCallback(
    (itemDraft) => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: createId("mood_item"),
          createdAt: new Date().toISOString(),
          position: getDefaultMoodboardPosition(state.form?.items.length ?? 0),
          size: "md",
          ...itemDraft,
        },
      });
    },
    [state.form?.items.length],
  );

  const updateItem = useCallback(
    (id, patch) => dispatch({ type: "UPDATE_ITEM", payload: { id, patch } }),
    [],
  );

  const removeItem = useCallback(
    (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    [],
  );

  const beginEditItem = useCallback(
    (id) => dispatch({ type: "BEGIN_EDIT_ITEM", payload: id }),
    [],
  );

  const cancelEditItem = useCallback(
    () => dispatch({ type: "CANCEL_EDIT_ITEM" }),
    [],
  );

  const bringItemForward = useCallback(
    (id) => {
      if (!state.form) return;
      const maxZ = getMaxZ(state.form.items);
      const item = state.form.items.find((entry) => entry.id === id);
      if (!item) return;
      dispatch({
        type: "UPDATE_ITEM",
        payload: {
          id,
          patch: { position: { ...item.position, z: maxZ + 1 } },
        },
      });
    },
    [state.form],
  );

  const sendItemBack = useCallback(
    (id) => {
      if (!state.form) return;
      const item = state.form.items.find((entry) => entry.id === id);
      if (!item) return;
      dispatch({
        type: "UPDATE_ITEM",
        payload: {
          id,
          patch: { position: { ...item.position, z: 0 } },
        },
      });
    },
    [state.form],
  );

  const setError = useCallback(
    (message) => dispatch({ type: "SET_ERROR", payload: message }),
    [],
  );

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  // -- Save: validates, dispatches to parent store, resets local state.
  const save = useCallback(
    (options = {}) => {
      if (!state.form) return null;

      const keepEditing = options?.keepEditing === true;
      const monthValue = state.form.month;
      const monthLabel = formatMonthLabel(monthValue);

      const isEdit = state.mode.kind === VISION_MODES.EDIT;
      const id = isEdit ? state.mode.boardId : createId("vb");
      const monthConflict = visionBoards.find(
        (board) => getBoardMonthValue(board) === monthValue && board.id !== id,
      );

      if (monthConflict) {
        dispatch({
          type: "SET_ERROR",
          payload: `${monthLabel} already has a moodboard. Use a different month.`,
        });
        return null;
      }

      const payload = {
        id,
        title: monthLabel,
        month: monthValue,
        prompt: state.form.prompt.trim(),
        playlistNote: state.form.playlistNote.trim(),
        items: state.form.items,
      };

      if (isEdit) {
        dispatchStore({ type: "UPDATE_VISION_BOARD", payload });
      } else {
        dispatchStore({
          type: "ADD_VISION_BOARD",
          payload: { ...payload, createdAt: new Date().toISOString() },
        });
      }

      dispatch({
        type: keepEditing ? "SAVE_SUCCESS_STAY_EDITING" : "SAVE_SUCCESS",
        payload: { boardId: id },
      });
      return id;
    },
    [state.form, state.mode, dispatchStore, visionBoards],
  );

  const removeBoard = useCallback(
    (id) => {
      dispatchStore({ type: "REMOVE_VISION_BOARD", payload: id });
      if (
        (state.mode.kind === VISION_MODES.EDIT && state.mode.boardId === id) ||
        state.activeBoardId === id
      ) {
        dispatch({ type: "CANCEL" });
      }
    },
    [dispatchStore, state.mode, state.activeBoardId],
  );

  return {
    // state
    mode: state.mode,
    form: state.form,
    error: state.error,
    isEditable: state.mode.kind !== VISION_MODES.VIEW,
    // derived
    sortedBoards,
    carouselBoards,
    currentMonthBoard,
    selectedBoard,
    workingBoard,
    blockedMonthValues,
    // actions
    selectBoard,
    beginCreate,
    beginEdit,
    cancel,
    setFormField,
    addItem,
    updateItem,
    removeItem,
    beginEditItem,
    cancelEditItem,
    bringItemForward,
    sendItemBack,
    setError,
    clearError,
    save,
    removeBoard,
  };
};

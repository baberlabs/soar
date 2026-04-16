import { useEffect, useMemo, useRef, useState } from "react";
import { useSOARState } from "../../hooks/useSOARState";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";

export default function Reflect() {
  const [state, dispatch] = useSOARState();
  const [tab, setTab] = useState("vision");

  const [visionTitle, setVisionTitle] = useState(() => {
    const month = new Date().toLocaleString("en-GB", { month: "long" });
    return `${month} Vision Board`;
  });

  const [visionPrompt, setVisionPrompt] = useState("");
  const [visionMonth, setVisionMonth] = useState(getDefaultMonthValue);
  const [playlistNote, setPlaylistNote] = useState("");

  const [draftCategory, setDraftCategory] = useState("Images");
  const [draftCaption, setDraftCaption] = useState("");
  const [draftText, setDraftText] = useState("");
  const [draftImageData, setDraftImageData] = useState("");
  const [draftItems, setDraftItems] = useState([]);
  const [draftHyperlink, setDraftHyperlink] = useState("");
  const [editingVisionBoardId, setEditingVisionBoardId] = useState(null);
  const [editingDraftItemId, setEditingDraftItemId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [visionError, setVisionError] = useState("");

  const draftBoardRef = useRef(null);

  const [activeLetterId, setActiveLetterId] = useState(null);
  const [letterTargetMonth, setLetterTargetMonth] = useState(getNextMonthValue);
  const [letterFeelings, setLetterFeelings] = useState("");
  const [letterActions, setLetterActions] = useState("");
  const [letterChallengePlan, setLetterChallengePlan] = useState("");
  const [letterAffirmation, setLetterAffirmation] = useState("");
  const [letterNote, setLetterNote] = useState("");
  const [letterError, setLetterError] = useState("");

  const [reviewLetterId, setReviewLetterId] = useState(null);
  const [reviewWhatHappened, setReviewWhatHappened] = useState("");
  const [reviewWhatChanged, setReviewWhatChanged] = useState("");
  const [reviewCarryForward, setReviewCarryForward] = useState("");

  const [unblurredLetterIds, setUnblurredLetterIds] = useState(new Set());

  if (!state.user) {
    return null;
  }

  const monthLabel = useMemo(
    () => formatMonthLabel(visionMonth),
    [visionMonth],
  );

  useEffect(() => {
    if (!dragState) return undefined;

    const handlePointerMove = (event) => {
      const boardRect = draftBoardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const maxXPercent =
        ((boardRect.width - MOODBOARD_ITEM_SIZE) / boardRect.width) * 100;
      const maxYPercent =
        ((boardRect.height - MOODBOARD_ITEM_SIZE) / boardRect.height) * 100;

      const leftPx = clamp(
        event.clientX - boardRect.left - dragState.offsetX,
        0,
        boardRect.width - MOODBOARD_ITEM_SIZE,
      );
      const topPx = clamp(
        event.clientY - boardRect.top - dragState.offsetY,
        0,
        boardRect.height - MOODBOARD_ITEM_SIZE,
      );

      const x = Math.round((leftPx / boardRect.width) * 1000) / 10;
      const y = Math.round((topPx / boardRect.height) * 1000) / 10;

      setDraftItems((items) =>
        items.map((item) =>
          item.id === dragState.id
            ? {
                ...item,
                position: {
                  ...(item.position || {}),
                  x: clamp(x, 0, maxXPercent),
                  y: clamp(y, 0, maxYPercent),
                },
              }
            : item,
        ),
      );
    };

    const stopDrag = () => setDragState(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
    };
  }, [dragState]);

  const handleDraftImage = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      const imageData = await fileToDataURL(files[0]);
      setDraftImageData(imageData);
      setVisionError("");
    } catch {
      setVisionError("Could not read that image file. Try a different one.");
    }
  };

  const addDraftItem = (event) => {
    event.preventDefault();

    if (!draftImageData && !draftText.trim()) {
      setVisionError("Add an image or a text note before adding a board item.");
      return;
    }

    const nextItem = {
      id: `mood_item_${Date.now()}`,
      category: draftCategory,
      caption: draftCaption.trim(),
      text: draftText.trim(),
      imageData: draftImageData || null,
      url: draftHyperlink.trim(),
      position: getDefaultMoodboardPosition(draftItems.length),
      createdAt: new Date().toISOString(),
    };

    setDraftItems((items) => [...items, nextItem]);
    setDraftCaption("");
    setDraftText("");
    setDraftImageData("");
    setDraftHyperlink("");
    setVisionError("");
  };

  const beginEditDraftItem = (itemId) => {
    const selected = draftItems.find((item) => item.id === itemId);
    if (!selected) return;

    setEditingDraftItemId(selected.id);
    setDraftCategory(selected.category || "Images");
    setDraftCaption(selected.caption || "");
    setDraftText(selected.text || "");
    setDraftImageData(selected.imageData || "");
    setDraftHyperlink(selected.url || "");
    setVisionError("");
  };

  const saveEditedDraftItem = (event) => {
    event.preventDefault();

    if (!editingDraftItemId) return;

    if (!draftImageData && !draftText.trim()) {
      setVisionError("Edited item needs an image or a text note.");
      return;
    }

    setDraftItems((items) =>
      items.map((item) =>
        item.id === editingDraftItemId
          ? {
              ...item,
              category: draftCategory,
              caption: draftCaption.trim(),
              text: draftText.trim(),
              imageData: draftImageData || null,
              url: draftHyperlink.trim(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    clearItemEditor();
    setVisionError("");
  };

  const clearItemEditor = () => {
    setEditingDraftItemId(null);
    setDraftCategory("Images");
    setDraftCaption("");
    setDraftText("");
    setDraftImageData("");
    setDraftHyperlink("");
  };

  const removeDraftItem = (itemId) => {
    setDraftItems((items) => items.filter((item) => item.id !== itemId));
    if (editingDraftItemId === itemId) {
      clearItemEditor();
    }
  };

  const startDragDraftItem = (event, itemId, index) => {
    const boardRect = draftBoardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const item = draftItems.find((entry) => entry.id === itemId);
    const position = item?.position || getDefaultMoodboardPosition(index);

    const leftPx = (position.x / 100) * boardRect.width;
    const topPx = (position.y / 100) * boardRect.height;

    setDragState({
      id: itemId,
      offsetX: event.clientX - (boardRect.left + leftPx),
      offsetY: event.clientY - (boardRect.top + topPx),
    });
  };

  const saveVision = (e) => {
    e.preventDefault();

    if (!visionTitle.trim()) {
      setVisionError("Give this moodboard a title before saving.");
      return;
    }

    if (draftItems.length === 0) {
      setVisionError("Add at least one moodboard item before saving.");
      return;
    }

    const payload = {
      id: editingVisionBoardId || `vb_${Date.now()}`,
      title: visionTitle.trim(),
      month: monthLabel,
      prompt: visionPrompt.trim(),
      playlistNote: playlistNote.trim(),
      items: draftItems,
    };

    if (editingVisionBoardId) {
      dispatch({ type: "UPDATE_VISION_BOARD", payload });
    } else {
      dispatch({
        type: "ADD_VISION_BOARD",
        payload: {
          ...payload,
          createdAt: new Date().toISOString(),
        },
      });
    }

    resetVisionComposer();
  };

  const editVisionBoard = (board) => {
    setTab("vision");
    setEditingVisionBoardId(board.id);
    setVisionTitle(board.title || "");
    setVisionPrompt(board.prompt || "");
    setPlaylistNote(board.playlistNote || "");
    setVisionMonth(toMonthInputValue(board.month, board.createdAt));

    const hydratedItems = (board.items || []).map((entry, index) => ({
      id: entry.id || `mood_item_${Date.now()}_${index}`,
      category: entry.category || "Images",
      caption: entry.caption || "",
      text: entry.text || "",
      imageData: entry.imageData || null,
      url: entry.url || "",
      position: entry.position || getDefaultMoodboardPosition(index),
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || null,
    }));

    setDraftItems(hydratedItems);
    clearItemEditor();
    setVisionError("");
  };

  const removeVisionBoard = (boardId) => {
    dispatch({ type: "REMOVE_VISION_BOARD", payload: boardId });

    if (editingVisionBoardId === boardId) {
      resetVisionComposer();
    }
  };

  const resetVisionComposer = () => {
    const nextMonth = getDefaultMonthValue();
    setEditingVisionBoardId(null);
    setVisionMonth(nextMonth);
    setVisionTitle(`${formatMonthLabel(nextMonth)} Vision Board`);
    setVisionPrompt("");
    setPlaylistNote("");
    clearItemEditor();
    setDraftItems([]);
    setDragState(null);
    setVisionError("");
  };

  const visionBoards = state.reflections?.visionBoards ?? [];
  const letters = useMemo(
    () =>
      (state.reflections?.letters ?? [])
        .map(normalizeMonthlyLetter)
        .sort((a, b) => b.targetMonth.localeCompare(a.targetMonth)),
    [state.reflections?.letters],
  );

  useEffect(() => {
    letters.forEach((letter) => {
      if (letter.status === "sealed" && isMonthUnlocked(letter.targetMonth)) {
        dispatch({ type: "MARK_MONTHLY_LETTER_OPENED", payload: letter.id });
      }
    });
  }, [letters, dispatch]);

  const resetLetterComposer = () => {
    setActiveLetterId(null);
    setLetterTargetMonth(getNextMonthValue());
    setLetterFeelings("");
    setLetterActions("");
    setLetterChallengePlan("");
    setLetterAffirmation("");
    setLetterNote("");
    setLetterError("");
  };

  const findEditableLetterForMonth = (monthValue) =>
    letters.find(
      (entry) =>
        entry.targetMonth === monthValue &&
        entry.id !== activeLetterId &&
        entry.status !== "reviewed",
    );

  const buildMonthlyLetterPayload = (letterId) => ({
    id: letterId,
    targetMonth: letterTargetMonth,
    status: "draft",
    intention: {
      feelings: letterFeelings.trim(),
      threeActions: letterActions.trim(),
      challengePlan: letterChallengePlan.trim(),
      affirmation: letterAffirmation.trim(),
    },
    noteToSelf: letterNote.trim(),
    ...(activeLetterId ? {} : { createdAt: new Date().toISOString() }),
  });

  const toggleSealedLetterBlur = (letterId) => {
    setUnblurredLetterIds((prev) => {
      const next = new Set(prev);
      if (next.has(letterId)) {
        next.delete(letterId);
      } else {
        next.add(letterId);
      }
      return next;
    });
  };

  const saveLetterDraft = (event) => {
    event.preventDefault();

    if (!letterFeelings.trim() || !letterActions.trim()) {
      setLetterError("Add how you want to feel and your 3 actions first.");
      return;
    }

    const existingForMonth = findEditableLetterForMonth(letterTargetMonth);
    const letterId =
      activeLetterId || existingForMonth?.id || `lt_${Date.now()}`;

    const payload = buildMonthlyLetterPayload(letterId);

    dispatch({ type: "UPSERT_MONTHLY_LETTER", payload });
    setActiveLetterId(payload.id);
    setLetterError("");
  };

  const sealLetter = (event) => {
    event.preventDefault();

    if (!letterFeelings.trim() || !letterActions.trim()) {
      setLetterError("Complete the key prompts before sealing the letter.");
      return;
    }

    const existingForMonth = findEditableLetterForMonth(letterTargetMonth);
    const id = activeLetterId || existingForMonth?.id || `lt_${Date.now()}`;
    dispatch({
      type: "UPSERT_MONTHLY_LETTER",
      payload: buildMonthlyLetterPayload(id),
    });
    dispatch({ type: "SEAL_MONTHLY_LETTER", payload: id });

    resetLetterComposer();
  };

  const editLetter = (letter) => {
    setTab("letters");
    setActiveLetterId(letter.id);
    setLetterTargetMonth(letter.targetMonth);
    setLetterFeelings(letter.intention.feelings);
    setLetterActions(letter.intention.threeActions);
    setLetterChallengePlan(letter.intention.challengePlan);
    setLetterAffirmation(letter.intention.affirmation);
    setLetterNote(letter.noteToSelf);
    setLetterError("");
  };

  const deleteLetter = (letterId) => {
    dispatch({ type: "REMOVE_MONTHLY_LETTER", payload: letterId });
    if (activeLetterId === letterId) {
      resetLetterComposer();
    }
    if (reviewLetterId === letterId) {
      clearReviewComposer();
    }
  };

  const beginReview = (letter) => {
    setReviewLetterId(letter.id);
    setReviewWhatHappened(letter.review?.whatHappened ?? "");
    setReviewWhatChanged(letter.review?.whatChanged ?? "");
    setReviewCarryForward(letter.review?.carryForward ?? "");
  };

  const clearReviewComposer = () => {
    setReviewLetterId(null);
    setReviewWhatHappened("");
    setReviewWhatChanged("");
    setReviewCarryForward("");
  };

  const saveReview = (event) => {
    event.preventDefault();
    if (!reviewLetterId) return;
    if (
      !reviewWhatHappened.trim() ||
      !reviewWhatChanged.trim() ||
      !reviewCarryForward.trim()
    ) {
      return;
    }

    dispatch({
      type: "MARK_MONTHLY_LETTER_REVIEWED",
      payload: {
        id: reviewLetterId,
        review: {
          whatHappened: reviewWhatHappened.trim(),
          whatChanged: reviewWhatChanged.trim(),
          carryForward: reviewCarryForward.trim(),
        },
      },
    });

    clearReviewComposer();
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <section className="mx-auto max-w-5xl space-y-8">
        <ReflectHeader />
        <ReflectTabs
          tab={tab}
          onTabChange={setTab}
          visionCount={visionBoards.length}
          letterCount={letters.length}
        />

        {tab === "vision" ? (
          <VisionTabPanel
            monthLabel={monthLabel}
            visionBoards={visionBoards}
            draftItems={draftItems}
            draftBoardRef={draftBoardRef}
            dragState={dragState}
            editingVisionBoardId={editingVisionBoardId}
            visionMonth={visionMonth}
            visionTitle={visionTitle}
            visionPrompt={visionPrompt}
            playlistNote={playlistNote}
            draftCategory={draftCategory}
            draftImageData={draftImageData}
            draftCaption={draftCaption}
            draftHyperlink={draftHyperlink}
            draftText={draftText}
            editingDraftItemId={editingDraftItemId}
            visionError={visionError}
            handleDraftImage={handleDraftImage}
            setVisionMonth={setVisionMonth}
            setVisionTitle={setVisionTitle}
            setVisionPrompt={setVisionPrompt}
            setPlaylistNote={setPlaylistNote}
            setDraftCategory={setDraftCategory}
            setDraftCaption={setDraftCaption}
            setDraftHyperlink={setDraftHyperlink}
            setDraftText={setDraftText}
            addDraftItem={addDraftItem}
            saveEditedDraftItem={saveEditedDraftItem}
            clearItemEditor={clearItemEditor}
            saveVision={saveVision}
            resetVisionComposer={resetVisionComposer}
            editVisionBoard={editVisionBoard}
            removeVisionBoard={removeVisionBoard}
            startDragDraftItem={startDragDraftItem}
            beginEditDraftItem={beginEditDraftItem}
            removeDraftItem={removeDraftItem}
          />
        ) : (
          <LetterTabPanel
            letters={letters}
            activeLetterId={activeLetterId}
            letterTargetMonth={letterTargetMonth}
            letterFeelings={letterFeelings}
            letterActions={letterActions}
            letterChallengePlan={letterChallengePlan}
            letterAffirmation={letterAffirmation}
            letterNote={letterNote}
            letterError={letterError}
            reviewLetterId={reviewLetterId}
            reviewWhatHappened={reviewWhatHappened}
            reviewWhatChanged={reviewWhatChanged}
            reviewCarryForward={reviewCarryForward}
            unblurredLetterIds={unblurredLetterIds}
            saveLetterDraft={saveLetterDraft}
            sealLetter={sealLetter}
            resetLetterComposer={resetLetterComposer}
            setLetterTargetMonth={setLetterTargetMonth}
            setLetterFeelings={setLetterFeelings}
            setLetterActions={setLetterActions}
            setLetterChallengePlan={setLetterChallengePlan}
            setLetterAffirmation={setLetterAffirmation}
            setLetterNote={setLetterNote}
            beginReview={beginReview}
            editLetter={editLetter}
            deleteLetter={deleteLetter}
            toggleSealedLetterBlur={toggleSealedLetterBlur}
            saveReview={saveReview}
            clearReviewComposer={clearReviewComposer}
            setReviewWhatHappened={setReviewWhatHappened}
            setReviewWhatChanged={setReviewWhatChanged}
            setReviewCarryForward={setReviewCarryForward}
          />
        )}
      </section>
    </main>
  );
}

function ReflectHeader() {
  return (
    <header className="space-y-3">
      <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
        Reflect
      </h1>
      <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
        Keep your long-term intentions clear. Capture a vision board for where
        you are heading and write letters to your future self.
      </p>
    </header>
  );
}

function ReflectTabs({ tab, onTabChange, visionCount, letterCount }) {
  return (
    <div className="flex gap-2 border-b border-brand/20">
      <button
        type="button"
        onClick={() => onTabChange("vision")}
        className={`px-4 py-3 font-ui text-sm tracking-[0.08em] ${tab === "vision" ? "border-b-2 border-brand text-brand" : "text-brand/60 hover:text-brand"}`}
      >
        Vision Boards ({visionCount})
      </button>
      <button
        type="button"
        onClick={() => onTabChange("letters")}
        className={`px-4 py-3 font-ui text-sm tracking-[0.08em] ${tab === "letters" ? "border-b-2 border-brand text-brand" : "text-brand/60 hover:text-brand"}`}
      >
        Future Letters ({letterCount})
      </button>
    </div>
  );
}

function VisionTabPanel(props) {
  const {
    monthLabel,
    visionBoards,
    draftItems,
    draftBoardRef,
    dragState,
    editingVisionBoardId,
    visionMonth,
    visionTitle,
    visionPrompt,
    playlistNote,
    draftCategory,
    draftImageData,
    draftCaption,
    draftHyperlink,
    draftText,
    editingDraftItemId,
    visionError,
    handleDraftImage,
    setVisionMonth,
    setVisionTitle,
    setVisionPrompt,
    setPlaylistNote,
    setDraftCategory,
    setDraftCaption,
    setDraftHyperlink,
    setDraftText,
    addDraftItem,
    saveEditedDraftItem,
    clearItemEditor,
    saveVision,
    resetVisionComposer,
    editVisionBoard,
    removeVisionBoard,
    startDragDraftItem,
    beginEditDraftItem,
    removeDraftItem,
  } = props;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <VisionComposer
        editingVisionBoardId={editingVisionBoardId}
        visionMonth={visionMonth}
        visionTitle={visionTitle}
        visionPrompt={visionPrompt}
        playlistNote={playlistNote}
        draftCategory={draftCategory}
        draftImageData={draftImageData}
        draftCaption={draftCaption}
        draftHyperlink={draftHyperlink}
        draftText={draftText}
        editingDraftItemId={editingDraftItemId}
        visionError={visionError}
        handleDraftImage={handleDraftImage}
        setVisionMonth={setVisionMonth}
        setVisionTitle={setVisionTitle}
        setVisionPrompt={setVisionPrompt}
        setPlaylistNote={setPlaylistNote}
        setDraftCategory={setDraftCategory}
        setDraftCaption={setDraftCaption}
        setDraftHyperlink={setDraftHyperlink}
        setDraftText={setDraftText}
        addDraftItem={addDraftItem}
        saveEditedDraftItem={saveEditedDraftItem}
        clearItemEditor={clearItemEditor}
        saveVision={saveVision}
        resetVisionComposer={resetVisionComposer}
      />

      <VisionLibrary
        monthLabel={monthLabel}
        draftItems={draftItems}
        draftBoardRef={draftBoardRef}
        dragState={dragState}
        visionBoards={visionBoards}
        startDragDraftItem={startDragDraftItem}
        beginEditDraftItem={beginEditDraftItem}
        removeDraftItem={removeDraftItem}
        editVisionBoard={editVisionBoard}
        removeVisionBoard={removeVisionBoard}
      />
    </div>
  );
}

function VisionComposer({
  editingVisionBoardId,
  visionMonth,
  visionTitle,
  visionPrompt,
  playlistNote,
  draftCategory,
  draftImageData,
  draftCaption,
  draftHyperlink,
  draftText,
  editingDraftItemId,
  visionError,
  handleDraftImage,
  setVisionMonth,
  setVisionTitle,
  setVisionPrompt,
  setPlaylistNote,
  setDraftCategory,
  setDraftCaption,
  setDraftHyperlink,
  setDraftText,
  addDraftItem,
  saveEditedDraftItem,
  clearItemEditor,
  saveVision,
  resetVisionComposer,
}) {
  return (
    <form
      onSubmit={saveVision}
      className="space-y-5 rounded-2xl border border-brand/20 bg-cream/80 p-6"
    >
      <h2 className="font-ui text-2xl text-brand">
        {editingVisionBoardId
          ? "Edit Saved Moodboard"
          : "Create Monthly Moodboard"}
      </h2>

      <div className="space-y-2">
        <label htmlFor="vision-month" className="font-body text-navy/60">
          Month
        </label>
        <input
          id="vision-month"
          type="month"
          value={visionMonth}
          onChange={(event) => setVisionMonth(event.target.value)}
          className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <InputField
        label="Title"
        type="text"
        name="vision-title"
        placeholder="July Vision Board"
        value={visionTitle}
        onValueChange={setVisionTitle}
      />

      <div className="space-y-2">
        <label htmlFor="vision-prompt" className="font-body text-navy/60">
          Focus statement
        </label>
        <textarea
          id="vision-prompt"
          value={visionPrompt}
          onChange={(e) => setVisionPrompt(e.target.value)}
          placeholder="What do you want this month to feel like?"
          rows="3"
          className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <InputField
        label="Month playlist / song"
        type="text"
        name="playlist-note"
        placeholder="One track to represent this month"
        value={playlistNote}
        onValueChange={setPlaylistNote}
      />

      <div className="space-y-3 rounded-xl border border-brand/15 bg-beige/70 p-4">
        <p className="font-ui text-sm tracking-[0.08em] text-brand">
          Add board item
        </p>

        <div className="flex flex-wrap gap-2">
          {MOODBOARD_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setDraftCategory(category)}
              className={`rounded-full border px-3 py-1.5 font-body text-xs transition ${
                draftCategory === category
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-brand/20 bg-beige text-brand/70 hover:border-brand/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="mood-image" className="font-body text-navy/60">
            Image (optional)
          </label>
          <input
            id="mood-image"
            type="file"
            accept="image/*"
            onChange={handleDraftImage}
            className="w-full rounded-xl border border-black/20 px-3 py-2 font-body text-sm text-navy"
          />
        </div>

        {draftImageData ? (
          <img
            src={draftImageData}
            alt="Draft moodboard upload"
            className="h-40 w-full rounded-xl object-cover"
          />
        ) : null}

        <InputField
          label="Caption"
          type="text"
          name="mood-caption"
          placeholder="Short label"
          value={draftCaption}
          onValueChange={setDraftCaption}
        />

        <InputField
          label="URL (optional)"
          type="text"
          name="mood-url"
          placeholder="https://www.example.com/"
          value={draftHyperlink}
          onValueChange={setDraftHyperlink}
        />

        <div className="space-y-2">
          <label htmlFor="mood-note" className="font-body text-navy/60">
            Note (optional)
          </label>
          <textarea
            id="mood-note"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="A quote, goal, reminder, recipe idea, or event note"
            rows="3"
            className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            text={editingDraftItemId ? "Save Item Changes" : "Add To Moodboard"}
            onClick={editingDraftItemId ? saveEditedDraftItem : addDraftItem}
          />
          {editingDraftItemId ? (
            <Button
              type="button"
              variant="ghost"
              text="Cancel Edit"
              onClick={clearItemEditor}
            />
          ) : null}
        </div>
      </div>

      {visionError ? (
        <p className="font-body text-sm text-rose-700">{visionError}</p>
      ) : null}

      <Button type="submit" text="Save Moodboard" />
      {editingVisionBoardId ? (
        <Button
          type="button"
          variant="ghost"
          text="Cancel Moodboard Edit"
          onClick={resetVisionComposer}
        />
      ) : null}
    </form>
  );
}

function VisionLibrary({
  monthLabel,
  draftItems,
  draftBoardRef,
  dragState,
  visionBoards,
  startDragDraftItem,
  beginEditDraftItem,
  removeDraftItem,
  editVisionBoard,
  removeVisionBoard,
}) {
  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-brand/20 bg-page p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-ui text-xl text-brand">{monthLabel}</p>
            <p className="font-body text-xs text-brand/60">
              Draft board ({draftItems.length} items)
            </p>
          </div>
        </div>

        <div
          ref={draftBoardRef}
          className="relative h-72 overflow-hidden rounded-2xl border border-brand/12 bg-[#e9eee3]"
        >
          {draftItems.length === 0 ? (
            <div className="flex h-full items-center justify-center px-6 text-center font-body text-sm text-brand/62">
              Your collage appears here as you add items.
            </div>
          ) : (
            draftItems.map((item, index) => {
              const style = getMoodboardItemStyle(item, index);
              return (
                <div
                  key={item.id}
                  className={`absolute rounded-xl border border-brand/15 bg-beige p-1 shadow-sm ${dragState?.id === item.id ? "cursor-grabbing" : "cursor-grab"}`}
                  style={style}
                  onPointerDown={(event) =>
                    startDragDraftItem(event, item.id, index)
                  }
                >
                  <div className="mb-1 flex items-center justify-end gap-1 px-1">
                    <button
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => beginEditDraftItem(item.id)}
                      className="rounded bg-brand/10 px-1.5 py-0.5 font-body text-[0.6rem] text-brand hover:bg-brand/20"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => removeDraftItem(item.id)}
                      className="rounded bg-rose-100 px-1.5 py-0.5 font-body text-[0.6rem] text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>

                  {item.imageData ? (
                    <img
                      src={item.imageData}
                      alt={item.caption || item.category}
                      className="h-20 w-20 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded bg-yellow/20 px-2 text-center font-body text-[0.68rem] leading-snug text-brand/84">
                      {item.text || item.caption || item.category}
                    </div>
                  )}

                  <p className="mt-1 line-clamp-1 px-1 font-body text-[0.62rem] text-brand/72">
                    {item.caption || item.category}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <p className="mt-3 font-body text-xs text-brand/65">
          Drag cards to arrange freely. Use Edit/Delete directly on each card.
        </p>
      </article>

      {visionBoards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand/30 bg-page p-8 text-center font-body text-brand/70">
          No moodboards saved yet.
        </div>
      ) : (
        visionBoards
          .slice()
          .reverse()
          .map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-brand/20 bg-cream p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-ui text-xl text-brand">{item.title}</h3>
                <p className="font-body text-xs text-brand/60">
                  {item.month || "Monthly board"}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  text="Edit Board"
                  onClick={() => editVisionBoard(item)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  text="Delete Board"
                  onClick={() => removeVisionBoard(item.id)}
                />
              </div>

              {item.items?.length ? (
                <div className="relative mt-3 h-56 overflow-hidden rounded-xl border border-brand/12 bg-[#e9eee3]">
                  {item.items.slice(0, 12).map((entry, index) => {
                    const style = getMoodboardItemStyle(entry, index);
                    return (
                      <div
                        key={entry.id}
                        className="absolute rounded-lg border border-brand/15 bg-white p-1 shadow-sm"
                        style={style}
                      >
                        {entry.imageData ? (
                          <img
                            src={entry.imageData}
                            alt={entry.caption || entry.category}
                            className="h-16 w-16 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded bg-yellow/20 px-1 text-center font-body text-[0.58rem] leading-snug text-brand/84">
                            {entry.text || entry.caption || entry.category}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {item.prompt ? (
                <p className="mt-2 font-body text-sm text-brand/80">
                  {item.prompt}
                </p>
              ) : null}
              {item.playlistNote ? (
                <p className="mt-2 font-body text-xs text-brand/70">
                  Playlist / song: {item.playlistNote}
                </p>
              ) : null}

              <p className="mt-3 font-body text-xs text-brand/60">
                Created {new Date(item.createdAt).toLocaleDateString()}
              </p>
              {item.updatedAt ? (
                <p className="mt-1 font-body text-xs text-brand/55">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              ) : null}
            </article>
          ))
      )}
    </section>
  );
}

function LetterTabPanel({
  letters,
  activeLetterId,
  letterTargetMonth,
  letterFeelings,
  letterActions,
  letterChallengePlan,
  letterAffirmation,
  letterNote,
  letterError,
  reviewLetterId,
  reviewWhatHappened,
  reviewWhatChanged,
  reviewCarryForward,
  unblurredLetterIds,
  saveLetterDraft,
  sealLetter,
  resetLetterComposer,
  setLetterTargetMonth,
  setLetterFeelings,
  setLetterActions,
  setLetterChallengePlan,
  setLetterAffirmation,
  setLetterNote,
  beginReview,
  editLetter,
  deleteLetter,
  toggleSealedLetterBlur,
  saveReview,
  clearReviewComposer,
  setReviewWhatHappened,
  setReviewWhatChanged,
  setReviewCarryForward,
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <LetterComposer
        activeLetterId={activeLetterId}
        letterTargetMonth={letterTargetMonth}
        letterFeelings={letterFeelings}
        letterActions={letterActions}
        letterChallengePlan={letterChallengePlan}
        letterAffirmation={letterAffirmation}
        letterNote={letterNote}
        letterError={letterError}
        saveLetterDraft={saveLetterDraft}
        sealLetter={sealLetter}
        resetLetterComposer={resetLetterComposer}
        setLetterTargetMonth={setLetterTargetMonth}
        setLetterFeelings={setLetterFeelings}
        setLetterActions={setLetterActions}
        setLetterChallengePlan={setLetterChallengePlan}
        setLetterAffirmation={setLetterAffirmation}
        setLetterNote={setLetterNote}
      />

      <LetterLibrary
        letters={letters}
        reviewLetterId={reviewLetterId}
        reviewWhatHappened={reviewWhatHappened}
        reviewWhatChanged={reviewWhatChanged}
        reviewCarryForward={reviewCarryForward}
        unblurredLetterIds={unblurredLetterIds}
        beginReview={beginReview}
        editLetter={editLetter}
        deleteLetter={deleteLetter}
        toggleSealedLetterBlur={toggleSealedLetterBlur}
        saveReview={saveReview}
        clearReviewComposer={clearReviewComposer}
        setReviewWhatHappened={setReviewWhatHappened}
        setReviewWhatChanged={setReviewWhatChanged}
        setReviewCarryForward={setReviewCarryForward}
      />
    </div>
  );
}

function LetterComposer({
  activeLetterId,
  letterTargetMonth,
  letterFeelings,
  letterActions,
  letterChallengePlan,
  letterAffirmation,
  letterNote,
  letterError,
  saveLetterDraft,
  sealLetter,
  resetLetterComposer,
  setLetterTargetMonth,
  setLetterFeelings,
  setLetterActions,
  setLetterChallengePlan,
  setLetterAffirmation,
  setLetterNote,
}) {
  return (
    <form
      onSubmit={saveLetterDraft}
      className="space-y-5 rounded-2xl border border-brand/20 bg-cream/80 p-6"
    >
      <h2 className="font-ui text-2xl text-brand">
        {activeLetterId ? "Edit Next-Month Letter" : "Write To Next-Month Self"}
      </h2>

      <div className="space-y-2">
        <label htmlFor="letter-target-month" className="font-body text-navy/60">
          Target month
        </label>
        <input
          id="letter-target-month"
          type="month"
          value={letterTargetMonth}
          onChange={(event) => setLetterTargetMonth(event.target.value)}
          className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <InputField
        label="How do you want to feel next month?"
        type="text"
        name="letter-feelings"
        placeholder="Grounded, focused, and joyful"
        value={letterFeelings}
        onValueChange={setLetterFeelings}
      />

      <div className="space-y-2">
        <label htmlFor="letter-actions" className="font-body text-navy/60">
          Three actions you will complete
        </label>
        <textarea
          id="letter-actions"
          value={letterActions}
          onChange={(event) => setLetterActions(event.target.value)}
          placeholder={"1) ...\n2) ...\n3) ..."}
          rows="4"
          className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="letter-challenge" className="font-body text-navy/60">
          If a challenge appears, how will you respond?
        </label>
        <textarea
          id="letter-challenge"
          value={letterChallengePlan}
          onChange={(event) => setLetterChallengePlan(event.target.value)}
          placeholder="When I feel stuck, I will..."
          rows="3"
          className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <InputField
        label="Affirmation"
        type="text"
        name="letter-affirmation"
        placeholder="I can grow with consistency"
        value={letterAffirmation}
        onValueChange={setLetterAffirmation}
      />

      <div className="space-y-2">
        <label htmlFor="letter-note" className="font-body text-navy/60">
          Note to your future self (optional)
        </label>
        <textarea
          id="letter-note"
          value={letterNote}
          onChange={(event) => setLetterNote(event.target.value)}
          placeholder="Remember why this month matters."
          rows="6"
          className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {letterError ? (
        <p className="font-body text-sm text-rose-700">{letterError}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" text="Save Draft" />
        <Button
          type="button"
          variant="secondary"
          text="Seal Letter"
          onClick={sealLetter}
        />
        {activeLetterId ? (
          <Button
            type="button"
            variant="ghost"
            text="New Letter"
            onClick={resetLetterComposer}
          />
        ) : null}
      </div>
    </form>
  );
}

function LetterLibrary({
  letters,
  reviewLetterId,
  reviewWhatHappened,
  reviewWhatChanged,
  reviewCarryForward,
  unblurredLetterIds,
  beginReview,
  editLetter,
  deleteLetter,
  toggleSealedLetterBlur,
  saveReview,
  clearReviewComposer,
  setReviewWhatHappened,
  setReviewWhatChanged,
  setReviewCarryForward,
}) {
  return (
    <section className="space-y-4">
      {letters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand/30 bg-page p-8 text-center font-body text-brand/70">
          No monthly letters yet.
        </div>
      ) : (
        letters.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-brand/20 bg-cream p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-ui text-xl text-brand">
                  {formatMonthLabel(item.targetMonth)} Letter
                </h3>
                <p className="mt-1 font-body text-xs text-brand/60">
                  Status: {item.statusLabel}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] uppercase tracking-[0.08em] ${
                  item.status === "reviewed"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === "unlocked"
                      ? "bg-yellow/40 text-brand"
                      : item.status === "sealed"
                        ? "bg-brand/10 text-brand"
                        : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {item.status !== "sealed" || unblurredLetterIds.has(item.id) ? (
              <>
                <p className="mt-3 font-body text-sm text-brand/80">
                  <strong>Feeling target:</strong> {item.intention.feelings}
                </p>
                <p className="mt-2 whitespace-pre-line font-body text-sm text-brand/80">
                  <strong>3 actions:</strong> {item.intention.threeActions}
                </p>
                {item.noteToSelf ? (
                  <p className="mt-2 font-body text-sm text-brand/78">
                    <strong>Note:</strong> {item.noteToSelf}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="mt-3 space-y-2 rounded-xl border border-brand/10 bg-white/50 p-4 backdrop-blur-sm">
                <p className="font-body text-sm text-brand/40 blur-sm select-none">
                  <strong>Feeling target:</strong> ••••••••••••••••••
                </p>
                <p className="whitespace-pre-line font-body text-sm text-brand/40 blur-sm select-none">
                  <strong>3 actions:</strong> ••••••••••••••••••
                </p>
              </div>
            )}

            {item.status === "sealed" ? (
              <p className="mt-2 font-body text-xs text-brand/62">
                Opens {item.unlockHint}
              </p>
            ) : null}

            {item.status === "sealed" ? (
              <div className="mt-3 flex items-center justify-between">
                <p className="font-body text-xs text-brand/70">
                  This letter is sealed until the target month
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  text={
                    unblurredLetterIds.has(item.id)
                      ? "Hide Content"
                      : "Reveal Content"
                  }
                  onClick={() => toggleSealedLetterBlur(item.id)}
                />
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              {item.status !== "sealed" ? (
                <Button
                  type="button"
                  variant="secondary"
                  text="Edit"
                  onClick={() => editLetter(item)}
                />
              ) : null}

              {(item.status === "unlocked" || item.status === "reviewed") && (
                <Button
                  type="button"
                  variant="secondary"
                  text={
                    item.status === "reviewed"
                      ? "View / Edit Review"
                      : "Add Review"
                  }
                  onClick={() => beginReview(item)}
                />
              )}

              <Button
                type="button"
                variant="ghost"
                text="Delete"
                onClick={() => deleteLetter(item.id)}
              />
            </div>

            {reviewLetterId === item.id ? (
              <form onSubmit={saveReview} className="mt-4 space-y-3">
                <textarea
                  value={reviewWhatHappened}
                  onChange={(event) =>
                    setReviewWhatHappened(event.target.value)
                  }
                  placeholder="What happened this month?"
                  rows="3"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
                />
                <textarea
                  value={reviewWhatChanged}
                  onChange={(event) => setReviewWhatChanged(event.target.value)}
                  placeholder="What changed in your thinking or behavior?"
                  rows="3"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
                />
                <textarea
                  value={reviewCarryForward}
                  onChange={(event) =>
                    setReviewCarryForward(event.target.value)
                  }
                  placeholder="What will you carry into next month?"
                  rows="3"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 font-body text-navy outline-none placeholder:text-navy/30 transition duration-200 focus:border-navy focus:ring-2 focus:ring-navy/20"
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" text="Save Review" />
                  <Button
                    type="button"
                    variant="ghost"
                    text="Cancel"
                    onClick={clearReviewComposer}
                  />
                </div>
              </form>
            ) : null}

            {item.review ? (
              <div className="mt-3 rounded-xl border border-brand/15 bg-page p-3">
                <p className="font-body text-xs text-brand/70">
                  <strong>What happened:</strong> {item.review.whatHappened}
                </p>
                <p className="mt-1 font-body text-xs text-brand/70">
                  <strong>What changed:</strong> {item.review.whatChanged}
                </p>
                <p className="mt-1 font-body text-xs text-brand/70">
                  <strong>Carry forward:</strong> {item.review.carryForward}
                </p>
              </div>
            ) : null}
          </article>
        ))
      )}
    </section>
  );
}

const MOODBOARD_CATEGORIES = [
  "Images",
  "Film / TV",
  "Books",
  "Activities",
  "Goals",
  "Music",
  "Recipes",
  "Hobbies",
  "Events",
];

const MOODBOARD_ITEM_SIZE = 96;

function getDefaultMonthValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(monthValue) {
  if (!monthValue) return "Current Month";

  const [year, month] = monthValue.split("-");
  if (!year || !month) return "Current Month";

  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return "Current Month";

  return date.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function getMoodboardItemStyle(item, index) {
  const fallback = getDefaultMoodboardPosition(index);
  const position = item?.position || fallback;

  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: `rotate(${position.rotate ?? fallback.rotate}deg)`,
  };
}

function getDefaultMoodboardPosition(index) {
  const positions = [
    { x: 12, y: 14, rotate: -7 },
    { x: 34, y: 18, rotate: 4 },
    { x: 56, y: 15, rotate: -3 },
    { x: 78, y: 26, rotate: 6 },
    { x: 16, y: 40, rotate: 5 },
    { x: 38, y: 38, rotate: -6 },
    { x: 62, y: 42, rotate: 2 },
    { x: 24, y: 64, rotate: -4 },
    { x: 48, y: 66, rotate: 3 },
    { x: 74, y: 62, rotate: -5 },
    { x: 12, y: 78, rotate: 4 },
    { x: 62, y: 80, rotate: -2 },
  ];

  return positions[index % positions.length];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toMonthInputValue(label, createdAt) {
  const fallback = getDefaultMonthValue();
  if (!label) return createdAt ? isoDateToMonth(createdAt) : fallback;

  const parsed = new Date(`${label} 1`);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  }

  return createdAt ? isoDateToMonth(createdAt) : fallback;
}

function isoDateToMonth(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return getDefaultMonthValue();
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

function getNextMonthValue() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

function monthToDate(monthValue) {
  const [year, month] = (monthValue || "").split("-");
  if (!year || !month) return null;

  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function isMonthUnlocked(monthValue) {
  const target = monthToDate(monthValue);
  if (!target) return true;

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return target.getTime() <= currentMonthStart.getTime();
}

function daysUntilMonth(monthValue) {
  const target = monthToDate(monthValue);
  if (!target) return 0;

  const now = new Date();
  const delta = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(delta / (1000 * 60 * 60 * 24)));
}

function statusToLabel(status) {
  if (status === "reviewed") return "Reviewed";
  if (status === "unlocked") return "Open now";
  if (status === "sealed") return "Sealed until target month";
  return "Draft";
}

function normalizeMonthlyLetter(letter) {
  const normalized = {
    id: letter.id || `lt_${Date.now()}`,
    targetMonth:
      letter.targetMonth ||
      (letter.openDate
        ? String(letter.openDate).slice(0, 7)
        : getNextMonthValue()),
    status: letter.status || "draft",
    intention: {
      feelings: letter.intention?.feelings || letter.title || "",
      threeActions: letter.intention?.threeActions || "",
      challengePlan: letter.intention?.challengePlan || "",
      affirmation: letter.intention?.affirmation || "",
    },
    noteToSelf: letter.noteToSelf || letter.body || "",
    review: letter.review || null,
    createdAt: letter.createdAt || new Date().toISOString(),
    sealedAt: letter.sealedAt || null,
    openedAt: letter.openedAt || null,
    reviewedAt: letter.reviewedAt || null,
    updatedAt: letter.updatedAt || null,
  };

  const effectiveStatus =
    normalized.status === "sealed" && isMonthUnlocked(normalized.targetMonth)
      ? "unlocked"
      : normalized.status;

  return {
    ...normalized,
    status: effectiveStatus,
    statusLabel: statusToLabel(effectiveStatus),
    unlockHint:
      daysUntilMonth(normalized.targetMonth) === 0
        ? "this month"
        : `in ${daysUntilMonth(normalized.targetMonth)} day(s)`,
  };
}

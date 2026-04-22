import { useEffect, useState } from "react";
import { Button } from "../../../../components/Button";
import { InputField } from "../../../../components/InputField";
import { MOODBOARD_CATEGORIES } from "../../constants";
import { fileToDataURL } from "../../utils/files";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * The mini form for adding and editing a single moodboard item.
 * Collapsible to give the canvas more vertical room when not in use.
 *
 * Self-contained draft state: holds the fields locally until the user clicks
 * Add / Save, then calls onSubmit with the final values. This means the
 * parent doesn't have to juggle six extra useState hooks.
 */
export const MoodboardItemEditor = ({
  editingItemId,
  existingItem,
  onAdd,
  onSaveEdit,
  onCancelEdit,
  onError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());

  // Expand and hydrate when an edit begins.
  useEffect(() => {
    if (editingItemId && existingItem) {
      setIsOpen(true);
      setDraft({
        category: existingItem.category || "Images",
        caption: existingItem.caption || "",
        text: existingItem.text || "",
        imageData: existingItem.imageData || "",
        url: existingItem.url || "",
      });
    }
  }, [editingItemId, existingItem]);

  const update = (field, value) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataURL(file, {
        maxBytes: MAX_IMAGE_BYTES,
        acceptedMimePrefix: "image/",
      });
      update("imageData", dataUrl);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not read that image file. Try a different one.";
      onError?.(message);
    }
  };

  const handleSubmit = () => {
    if (!draft.imageData && !draft.text.trim()) {
      onError?.("Add an image or a note before saving this item.");
      return;
    }

    const payload = {
      category: draft.category,
      caption: draft.caption.trim(),
      text: draft.text.trim(),
      imageData: draft.imageData || null,
      url: draft.url.trim(),
    };

    if (editingItemId) {
      onSaveEdit(editingItemId, payload);
    } else {
      onAdd(payload);
    }

    setDraft(emptyDraft());
  };

  const handleCancel = () => {
    setDraft(emptyDraft());
    onCancelEdit();
  };

  return (
    <div className="space-y-3 rounded-3xl border border-brand/15 bg-cream/70 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/65">
          {editingItemId ? "Edit item" : "Add item"}
        </p>
        <Button
          type="button"
          variant={isOpen ? "ghost" : "secondary"}
          size="sm"
          fullWidth={false}
          text={isOpen ? "Hide panel" : "Add new item"}
          onClick={() => setIsOpen((open) => !open)}
        />
      </div>

      {!isOpen ? (
        <p className="font-body text-xs text-brand/70">
          Expand the panel to add an image, note, or link to this moodboard.
        </p>
      ) : (
        <>
          <fieldset className="flex flex-wrap gap-1.5">
            <legend className="sr-only">Category</legend>
            {MOODBOARD_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => update("category", category)}
                aria-pressed={draft.category === category}
                className={`rounded-full border px-3 py-1.5 font-body text-xs transition duration-200 ${
                  draft.category === category
                    ? "border-brand bg-brand text-cream shadow-[0_8px_18px_rgba(75,81,149,0.18)]"
                    : "border-brand/20 bg-cream text-brand/70 hover:border-brand/40 hover:bg-brand/5"
                }`}
              >
                {category}
              </button>
            ))}
          </fieldset>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="mood-image"
              className="font-body text-sm text-brand/70"
            >
              Image <span className="text-brand/45">(optional)</span>
            </label>
            <input
              id="mood-image"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full rounded-2xl border border-black/15 bg-cream px-3 py-2 font-body text-sm text-navy file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-3 file:py-1 file:font-ui file:text-xs file:text-brand hover:file:bg-brand/15"
            />
          </div>

          {draft.imageData ? (
            <img
              src={draft.imageData}
              alt="Draft moodboard upload preview"
              className="h-40 w-full rounded-2xl border border-brand/10 object-cover"
            />
          ) : null}

          <InputField
            label="Caption"
            type="text"
            name="mood-caption"
            placeholder="Short label (optional)"
            value={draft.caption}
            onValueChange={(value) => update("caption", value)}
            required={false}
          />

          <InputField
            label="Link"
            type="text"
            name="mood-url"
            placeholder="https://example.com (optional)"
            value={draft.url}
            onValueChange={(value) => update("url", value)}
            required={false}
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="mood-note"
              className="font-body text-sm text-brand/70"
            >
              Note <span className="text-brand/45">(optional)</span>
            </label>
            <textarea
              id="mood-note"
              value={draft.text}
              onChange={(event) => update("text", event.target.value)}
              placeholder="A quote, goal, reminder, recipe idea, or event"
              rows="3"
              className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth={false}
              text={editingItemId ? "Save changes" : "Add to moodboard"}
              onClick={handleSubmit}
            />
            {editingItemId ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                fullWidth={false}
                text="Cancel edit"
                onClick={handleCancel}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

const emptyDraft = () => ({
  category: "Images",
  caption: "",
  text: "",
  imageData: "",
  url: "",
});

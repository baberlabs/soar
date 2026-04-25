import { useState } from "react";
import { Button } from "../../../../components/Button";
import { InputField } from "../../../../components/InputField";
import { formatBytes } from "../../../../utils/format";
import { createAttachmentId } from "../../../../utils/ids";
import { readFileAsDataUrl } from "../../utils/attachments";

/**
 * Shared form used by new drafts and edits of existing drafts/discussion
 * proposals. Self-contained local state: flushes to the parent only on
 * submit actions, so parents can choose which action button triggered
 * which store dispatch (Save draft vs Publish).
 *
 * Validation: title ≥ 5 chars, description ≥ 40 chars. These thresholds
 * discourage one-word proposals without being painful, tuned based on
 * what reads as "a proposal" vs "a whim."
 */
const MIN_TITLE = 5;
const MIN_DESCRIPTION = 40;
const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

export const ProposalForm = ({
  initialTitle = "",
  initialDescription = "",
  initialAttachments = [],
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onCancel,
  isEdit = false,
  submitting = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [error, setError] = useState("");

  const handleAttachmentPick = async (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setError(`You can add up to ${MAX_ATTACHMENTS} attachments.`);
      return;
    }

    const oversized = files.find((file) => file.size > MAX_ATTACHMENT_BYTES);
    if (oversized) {
      setError(
        `${oversized.name} is too large. Max size is ${formatBytes(MAX_ATTACHMENT_BYTES)} per file.`,
      );
      return;
    }

    try {
      const next = await Promise.all(
        files.map(async (file) => ({
          id: createAttachmentId(),
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: await readFileAsDataUrl(file),
        })),
      );
      setAttachments((prev) => [...prev, ...next]);
      setError("");
    } catch {
      setError("Could not attach one or more files. Try again.");
    }
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
  };

  const validate = () => {
    if (title.trim().length < MIN_TITLE) {
      setError(`Title needs at least ${MIN_TITLE} characters.`);
      return false;
    }
    if (description.trim().length < MIN_DESCRIPTION) {
      setError(
        `Give peers enough context — at least ${MIN_DESCRIPTION} characters.`,
      );
      return false;
    }
    setError("");
    return true;
  };

  const handlePrimary = () => {
    if (submitting) return;
    if (!validate()) return;
    onPrimary({
      title: title.trim(),
      description: description.trim(),
      attachments,
    });
  };

  const handleSecondary = () => {
    if (submitting) return;
    // Secondary (save draft) can be permissive — allow saving drafts with
    // minimal content because the whole point is to pick it up later.
    if (!title.trim()) {
      setError("Give your draft a working title before saving.");
      return;
    }
    setError("");
    onSecondary?.({
      title: title.trim(),
      description: description.trim(),
      attachments,
    });
  };

  const descriptionRemaining = Math.max(
    0,
    MIN_DESCRIPTION - description.trim().length,
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handlePrimary();
      }}
      className="space-y-5"
    >
      <InputField
        label="Title"
        type="text"
        name="proposal-title"
        placeholder="A short, specific headline"
        value={title}
        onValueChange={setTitle}
      />

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="proposal-description"
            className="font-body text-navy/60"
          >
            Description
          </label>
          {descriptionRemaining > 0 ? (
            <span className="font-body text-xs text-brand/55">
              {descriptionRemaining} more character
              {descriptionRemaining === 1 ? "" : "s"}
            </span>
          ) : (
            <span className="font-body text-xs text-sage">Good length</span>
          )}
        </div>
        <textarea
          id="proposal-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows="7"
          placeholder="What should change, and why does it matter for peers?"
          className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <div className="space-y-2 rounded-2xl border border-brand/12 bg-page/60 p-4">
        <p className="font-body text-sm text-brand/75">
          Attachments (optional)
        </p>
        <p className="font-body text-xs text-brand/55">
          Up to {MAX_ATTACHMENTS} files, {formatBytes(MAX_ATTACHMENT_BYTES)}{" "}
          each.
        </p>
        <input
          type="file"
          multiple
          onChange={handleAttachmentPick}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.md,.json,.csv"
          disabled={submitting || attachments.length >= MAX_ATTACHMENTS}
          className="block w-full text-sm file:mr-3 file:rounded-full file:border file:border-brand/20 file:bg-cream file:px-3 file:py-1.5 file:font-ui file:text-xs file:tracking-[0.04em] file:text-brand hover:file:border-brand/35"
        />

        {attachments.length ? (
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand/12 bg-cream px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-body text-sm text-brand/80">
                    {attachment.name}
                  </p>
                  <p className="font-body text-xs text-brand/55">
                    {formatBytes(attachment.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  disabled={submitting}
                  className="rounded-full border border-brand/20 px-2.5 py-1 font-ui text-[0.62rem] tracking-[0.06em] text-brand/70 transition hover:border-brand/35 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="font-body text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-brand/10 pt-5">
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth={false}
          text={primaryLabel}
          disabled={submitting}
        />
        {secondaryLabel ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth={false}
            text={secondaryLabel}
            onClick={handleSecondary}
            disabled={submitting}
          />
        ) : null}
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth={false}
            text="Cancel"
            onClick={onCancel}
            disabled={submitting}
          />
        ) : null}
      </div>

      {!isEdit ? (
        <p className="font-body text-xs text-brand/55">
          Save a draft now, refine it later. Drafts are only visible to you.
        </p>
      ) : null}
    </form>
  );
};

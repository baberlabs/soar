import { useEffect, useRef, useState } from "react";
import { A11Y_LABELS } from "../../constants";
import { toExternalUrl } from "../../utils/files";
import { getMoodboardItemStyle } from "../../utils/moodboard";
import hyperlinkIcon from "../../../../assets/icons/hyperlink.svg";

/**
 * A single moodboard item. Rendered as a button (tabindex=0) when editable
 * so keyboard users can focus it and use arrow keys to reposition via
 * useMoodboardDrag's handleItemKeyDown.
 */
export const MoodboardItem = ({
  item,
  index,
  isEditable,
  isDragging,
  isFocused,
  onPointerDown,
  onKeyDown,
  onFocus,
  onBeginEdit,
  onRemove,
  onExpandImage,
  onResize,
  onBringForward,
  onSendBack,
}) => {
  const style = getMoodboardItemStyle(item, index);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const noteText = String(item.text || "").trim();
  const hasNote = Boolean(noteText);
  const baseZ = Number(style.zIndex) || 1;
  const containerStyle = {
    ...style,
    // Keep menus usable even for items sent behind others.
    zIndex: isMenuOpen ? Math.max(baseZ, 9999) : baseZ,
  };

  const interactiveClass = isEditable
    ? isDragging
      ? "cursor-grabbing scale-[1.03] ring-2 ring-brand/40"
      : isFocused
        ? "cursor-grab ring-2 ring-brand/60"
        : "cursor-grab hover:scale-[1.02]"
    : "cursor-default";

  const stopPointer = (event) => event.stopPropagation();

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const runAction = (event, fn) => {
    event.stopPropagation();
    fn();
    closeMenu();
  };

  const hasMenuActions = isEditable;

  return (
    <div
      role={isEditable ? "group" : "img"}
      tabIndex={isEditable ? 0 : -1}
      aria-label={
        isEditable
          ? A11Y_LABELS.moodboardItem(item.category, item.caption)
          : `${item.category}${item.caption ? `: ${item.caption}` : ""}`
      }
      className={`absolute rounded-2xl border border-brand/12 bg-cream p-1.5 shadow-[0_12px_30px_rgba(42,49,90,0.16)] backdrop-blur-sm transition focus-visible:outline-none ${interactiveClass}`}
      style={containerStyle}
      onPointerDown={
        isEditable ? (event) => onPointerDown(event, item.id) : undefined
      }
      onKeyDown={isEditable ? (event) => onKeyDown(event, item.id) : undefined}
      onFocus={isEditable ? () => onFocus(item.id) : undefined}
    >
      {hasMenuActions ? (
        <div ref={menuRef} className="absolute right-1 top-1 z-20">
          <button
            type="button"
            aria-label="Moodboard item actions"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onPointerDown={stopPointer}
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen((open) => !open);
            }}
            className="absolute right-0 top-0 inline-flex h-6 w-6 items-center justify-center rounded-md border border-brand/15 bg-cream text-brand/80 shadow-[0_6px_16px_rgba(42,49,90,0.12)] hover:bg-brand/10"
            title="Actions"
          >
            <span aria-hidden="true" className="flex items-center gap-0.5">
              <span className="h-0.5 w-0.5 rounded-full bg-current" />
              <span className="h-0.5 w-0.5 rounded-full bg-current" />
              <span className="h-0.5 w-0.5 rounded-full bg-current" />
            </span>
          </button>

          {isMenuOpen ? (
            <div
              role="menu"
              className="mt-7 w-40 rounded-xl border border-brand/15 bg-cream p-1.5 shadow-[0_14px_30px_rgba(42,49,90,0.2)]"
              onPointerDown={stopPointer}
            >
              {isEditable ? (
                <>
                  <MenuLabel text="Size" />
                  <div className="grid grid-cols-3">
                    <MenuAction
                      onClick={(event) =>
                        runAction(event, () => onResize(item.id, "sm"))
                      }
                      text="S"
                      tone={item.size === "sm" ? "brand" : "neutral"}
                    />
                    <MenuAction
                      onClick={(event) =>
                        runAction(event, () => onResize(item.id, "md"))
                      }
                      text="M"
                      tone={item.size === "md" ? "brand" : "neutral"}
                    />
                    <MenuAction
                      onClick={(event) =>
                        runAction(event, () => onResize(item.id, "lg"))
                      }
                      text="L"
                      tone={item.size === "lg" ? "brand" : "neutral"}
                    />
                  </div>

                  <MenuLabel text="Layer" />
                  <MenuAction
                    onClick={(event) =>
                      runAction(event, () => onBringForward(item.id))
                    }
                    text="Bring forward"
                  />
                  <MenuAction
                    onClick={(event) =>
                      runAction(event, () => onSendBack(item.id))
                    }
                    text="Send back"
                  />

                  <MenuLabel text="Item" />
                  <MenuAction
                    onClick={(event) =>
                      runAction(event, () => onBeginEdit(item.id))
                    }
                    text="Edit item"
                  />
                  <MenuAction
                    onClick={(event) =>
                      runAction(event, () => onRemove(item.id))
                    }
                    text="Remove item"
                    tone="danger"
                  />
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {item.imageData ? (
        <div className="space-y-1.5">
          <button
            type="button"
            onPointerDown={stopPointer}
            onClick={() =>
              onExpandImage(item.imageData, item.caption || item.category)
            }
            className="block w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            aria-label={`Expand ${item.caption || item.category}`}
          >
            <img
              src={item.imageData}
              alt={item.caption || item.category}
              className="aspect-square w-full rounded-xl object-cover"
            />
          </button>

          {hasNote ? (
            <p className="rounded-lg bg-brand/5 px-2 py-1.5 font-body text-[0.64rem] leading-snug text-brand/82">
              {noteText}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-yellow/25 px-2 py-2 text-center font-body text-[0.72rem] leading-snug text-brand/85">
          {noteText || item.caption || item.category}
        </div>
      )}

      <p className="mt-1 line-clamp-1 px-1 font-body text-[0.66rem] text-brand/72">
        {item.caption || item.category}
      </p>

      <div className="flex items-end justify-between gap-1 px-1">
        <p className="font-body text-[0.58rem] uppercase tracking-[0.08em] text-brand/55">
          {item.category}
        </p>
        {item.url ? (
          <a
            href={toExternalUrl(item.url)}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={stopPointer}
            onClick={stopPointer}
            className="inline-flex h-5 w-5 items-center justify-center text-brand/70 hover:bg-brand/5"
            aria-label={`Open link for ${item.caption || item.category}`}
            title="Open link"
          >
            <img src={hyperlinkIcon} alt="" className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};

const MenuLabel = ({ text }) => (
  <p className="mb-1 mt-1 px-2 font-ui text-[0.62rem] uppercase tracking-[0.12em] text-brand/50">
    {text}
  </p>
);

const MenuAction = ({ text, onClick, tone = "neutral" }) => {
  const toneClass =
    tone === "danger"
      ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
      : tone === "brand"
        ? "bg-brand/80 hover:bg-brand/95 text-cream"
        : "text-brand/80 hover:bg-brand/5";

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`block w-full rounded-lg px-2 py-1.5 text-left font-body text-xs transition ${toneClass}`}
    >
      {text}
    </button>
  );
};

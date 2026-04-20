import { Button } from "../../../../components/Button";

/**
 * Banner shown above the chat composer when a connection is pending.
 *
 * This breaks the fourth wall intentionally — peer profiles are mock data
 * from PEER_DIRECTORY, not real peers who could accept your request. The
 * banner is honest about that and offers the one sensible action: simulate
 * acceptance so the user can experience the rest of the flow.
 *
 * Styled to look different from normal chat chrome (yellow accent, dashed
 * border) so the user registers this as a system message, not something
 * the peer said.
 */
export const PendingChatBanner = ({ peerName, onAccept }) => (
  <div
    role="status"
    className="mx-4 mt-4 mb-2 rounded-2xl border border-dashed border-yellow/70 bg-yellow/20 p-4"
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/65">
          Request pending
        </p>
        <p className="font-body text-sm leading-relaxed text-brand/80">
          {peerName ?? "This peer"} is a mock profile for demo purposes —
          there&rsquo;s no real person on the other end. Accept on their behalf
          to continue the conversation.
        </p>
      </div>
      <Button
        type="button"
        variant="primary"
        size="sm"
        fullWidth={false}
        text={`Accept as ${peerName?.split(" ")[0] ?? "them"}`}
        onClick={onAccept}
      />
    </div>
  </div>
);

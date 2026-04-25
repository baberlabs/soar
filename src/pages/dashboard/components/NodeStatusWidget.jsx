import { Link } from "react-router-dom";
import { Server } from "lucide-react";
import { useSOARState } from "../../../store";
import { WidgetCard } from "./WidgetCard";

/**

 * For now the node is treated as live whenever a peer is signed in;
 * the in-browser node initialises on registration. When a real
 * initialisation pipeline lands, swap the status check for a real flag
 * (e.g. `state.user?.nodeStatus === "live"`) and add the spinner branch
 * for the initialising state described in the spec.
 */
export const NodeStatusWidget = () => {
  const state = useSOARState();
  const isLive = Boolean(state.user);

  return (
    <WidgetCard>
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage"
        >
          <Server size={18} strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-ui text-xl text-brand">
              {isLive
                ? "Your personal data node is live."
                : "Node status unavailable."}
            </h2>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/12 px-2.5 py-1 font-body text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-sage">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-sage"
                />
                Live
              </span>
            ) : null}
          </div>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
            Everything you do on SOAR is stored on your node, not on a central
            server. You own it, you can export it, and you can take it with you.
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-3 border-t border-brand/10 pt-4">
        <Link
          to="/account/node"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          View node details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </WidgetCard>
  );
};

# Feedback #02 Applied

1.1 Added the donation banner below Newsletter and linked it to the donation page.

---

3.0 Expanded Moodboard support to explicitly handle images, notes, and links.

3.1 Moodboard items now show links clearly, can be edited from saved boards, and remain usable after saving.

3.2 Moodboard items now surface notes in a clearer UI so image items do not hide useful context.

3.3 Moodboard creation now uses month-based naming instead of custom titles.

3.4 Users can create only one moodboard per month.

3.5 Moodboard editing now includes a cinema mode that expands the canvas fullscreen (reason = why not?).

3.6 Replaced all fields in Future Letters with one text field called "Letter".

3.6 Only one letter for the future self is allowed.

3.7 Users can archive draft, sealed and previously sealed letters.

---

4.1 Replaced "member(s)" terminology with "peer(s)" across all pages.

---

5.1 Expanded About page content to better explain mission and platform flow

---

6.1 Added a "How SOAR works" step inside onboarding/registration

---

8.1 Implemented a dedicated local events section in Connect with match-ordered event cards.

8.2 Added practical event guidance in Connect for finding and joining SOAR in-person sessions.

8.3 Linked events into peer discovery and chats so users can move from discovery to coordination in one flow.

8.4 Expanded peer discovery from a basic suggested list into a dedicated Find New Peers flow with search and pathway filtering.

8.5 Reworked connection logic to use the single canonical connection schema (`members`) and removed legacy dual-schema handling.

8.6 Added recommendation scoring based on shared interests and pathways, with clearer match reasoning shown per peer.

8.7 Introduced dedicated peer profile routing and profile pages, with connected-peer access rules and richer peer context.

8.8 Upgraded chats from simple inline message blocks to a two-pane chat workspace with conversation list, active thread, timestamps, Enter-to-send, and stable auto-scroll behaviour.

8.9 Unified peers, chats, and events into one connected journey, including cross-navigation between discovery, profile view, conversations, and event coordination.

---

9.1 Replaced flat `/account` page with a sidebar-navigated seven-section layout (profile, activity, peers, node, data, coming soon).

9.2 Added profile personalisation: avatar upload, bio, location, timezone, interests editor, and website/GitHub/LinkedIn links.

9.3 Rebuilt the IPFS node section as a functional status panel showing PeerID, multiaddrs, live storage usage, connected peer count, uptime, and the full list of pinned CIDs — all derived from real store data.

9.4 Added data controls: export store as JSON, restore from a prior export, and a type-to-confirm device reset.

9.5 Added an Activity section surfacing learning, creations, and reflections counts with direct links to each page.

9.6 Moved sign-out into the sidebar footer so it is reachable from every account sub-page.

9.7 Applied copy-reduction pass (same standard as Connect): removed marketing and placeholder prose in favour of self-evident UI.

9.8 Grouped Security, Notifications, and Theme under a single honest "Coming soon" section pending backend support.

9.9 Extended the peer record schema with avatar, bio, location, timezone, links, and preferences fields (additive — existing peers get defaults at load).

---

11.1 Added a payment-first flow to Join so users complete payment before final account registration.

11.2 Added support for card, PayPal, Apple Pay, Google Pay, bank transfer, and Bitcoin payment options.

11.3 Added flexible contribution amounts with a £1 minimum.

11.4 Added method-specific validation and surfaced payment method/reference in the final review step.

---

12.1 Added ScrollToTop on route navigation

---

#TODO 2. Deferred to next iteration
#TODO 7. Deferred to next iteration
#TODO 10. Deferred to next iteration

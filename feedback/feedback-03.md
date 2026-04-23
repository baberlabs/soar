# Iteration 3: Final Feature & UX Completion

Date: 10 April 2026, 16:00 - 17:00

The following todos are based on feedback from client and my own observations.

## 1. Dashboard Page

#TODO 1a. Plan: Determine content of Dashboard and refactor Account page.

#TODO 1b. Feat: Build a dashboard (progress summary, recent activity, quick-resume).

#TODO 1c. Feat: Make dashboard the entry-point for the app (logged in user).

## 2. Session Page (Make this SERIOUSLY Pro)

~~2a. Fix: Rename image files (trailing spaces).~~

#TODO 2b. Feat: For one selected path, design the complete flow in (relative) depth. This path must demonstrate the full Learn → Reflect → Create → Share/Connect journey to show how SOAR's integrated model works end-to-end.

#TODO 2c. Fix: Shuffle quiz options so correct isn't always the first one.

#TODO 2d. Feat: Use other forms of learning, such as flash cards.

#TODO 2e. Feat: Make reflection step mandatory and connect it to Create page.

#TODO 2f. Feat: Replace emojis with brand-aligned visuals.

#TODO 2g. Feat: Use relevant imagery in sessions tailored to each subject, not default placeholders.

## 3. Accreditation & Verification System

#TODO 3a. Feat: Design and implement accreditation badge system for completed learning paths. Badges should be verifiable and optionally shareable (exportable proof of completion).

#TODO 3b. Feat: Display accreditation prominently in Account > Activity and on Dashboard to reassure peers that learning is solid, credited, and intentional.

#TODO 3c. Feat: Add accreditation metadata to exported user data so peers can prove completion to external parties if desired.

## 4. Forum & Governance UI (NEW)

#TODO 4a. Feat: Build Forum page with pro-level UI for peer proposals and discussions.

#TODO 4b. Feat: Implement proposal submission flow where peers can suggest platform changes with title, description, and optional attachments.

#TODO 4c. Feat: Create voting interface where peers vote on active proposals (one-peer-one-vote). Display vote counts, status (open/closed), and outcomes.

#TODO 4d. Feat: Display archived proposals and outcomes so peers see decisions made and understand platform evolution.

#TODO 4e. Feat: Connect governance activities to Account > Activity to show peer participation in decision-making.

## 5. Data Sovereignty & Transparency (NEW)

#TODO 5a. Feat: Add Data Transparency section to Account showing what data SOAR holds about the peer (profile, learning history, creations, reflections, connections).

#TODO 5b. Feat: Implement data export flow (JSON export of all personal data) with single-click download.

#TODO 5c. Feat: Add data portability info to Account so peers understand they own their data and can leave with it.

#TODO 5d. Feat: Display data sharing consent controls (what is shared with connected peers, what is public, what is private).

## 6. Unify Learn, Create and Connect Model

#TODO 6a. Refactor: Unify the Learn, Create and Connect model, separating Vision Board and Letter to Next-Month-Self from the main flow.

#TODO 6b. Feat: Show connection points between Learn sessions and Create page (e.g., "Share your output from this session" prompts).

#TODO 6c. Feat: Connect session completions to suggested peer matches in Connect page (e.g., "Find peers learning this topic").

## 7. Home Page & About Page

~~7a. Feat: Rewrite Home and About pages' copy to reflect SOAR's radical mission: data ownership, educational liberation, collective governance, and moving from passive consumption to intentional progress.~~

~~7b. Feat: Add visual hierarchy and storytelling to About that communicates the five core shifts (scrolling → completion, consumption → creation, users → peers, central control → shared governance, data extraction → data ownership).~~

## 8. Create Page

#TODO 8a. Feat: View connected peers' creation in Create page gallery so users can draw inspiration and see what peers are working on.

#TODO 8b. Fix: Pressing Enter on creation form saves the item.

## 9. Letter Page (Already Largely Complete)

#TODO 9a. Review: Confirm letter archive (drafts, sealed, unsealed) is complete and intuitive. Archived letters should be retrievable and show lifecycle state clearly.

## 10. Connect Page

#TODO 10a. Feat: Add one detailed event with all necessary information (full details, logistics, learning outcomes). Use this as the canonical example and base template for other events.

## 11. Account Page

#TODO 11a. Feat: Add IPFS node explanation (what it is, why peers have one, what it does) to Account > Node or About page. Should be accessible to non-technical peers.

## 12. Onboarding Page

#TODO 12a. Fix: Implement ScrollToTop for all onboarding slides so users start at the top of each step.

#TODO 12b. Feat: Remove onboarding Step 2 (filler content) to tighten flow and reduce friction.

#TODO 12c. Feat: Add progress visuals (progress bar, step indicators, etc.) to onboarding to set expectations and reduce UX friction.

## 13. Navigation & Information Architecture

#TODO 13a. Feat: Keep Home, Learn, Create, and Connect in the top-level navigation. Move secondary pages (About, Account, Forum, Donate) into a drop-down menu or footer to clarify core vs supporting features.

## 14. Copy & Messaging (Final Pass)

#TODO 14a. Feat: Remove redundant copy across all pages. If something can be "shown" in the UI, do not "tell" it in text (except for accessibility purposes).

#TODO 14b. Feat: Tighten all words. Replace corporate, generic, or placeholder language with SOAR's bold, hopeful, radical tone.

#TODO 14c. Feat: Audit all CTAs (Call To Actions) to ensure they are clear, action-oriented, and aligned with mission. Primary CTA: "Become a Peer (£1)."

## 15. Security & Data

#TODO 15a. Feat: Save hashed password in localStorage for optional auto-login (with explicit user consent and timeout controls).

#TODO 15b. Review: Confirm payment flow is non-blocking for demo purposes.

## 16. Brand & Visuals

#TODO 16a. Feat: Audit all emojis and replace with brand-aligned visuals (custom icons, illustrations) that reinforce SOAR's identity.

#TODO 16b. Feat: Ensure imagery across all pages (Home, About, Learn, Create, Connect) is cohesive, high-quality, and supports the radical curriculum narrative.

#TODO 16c. Review: Confirm colour palette, typography, and visual hierarchy are consistent, accessible, and professional.

## 17. Accessibility & Inclusion (Full Audit)

#TODO 17a. Test: Confirm all pages are fully navigable via keyboard.

#TODO 17b. Test: Confirm all images have descriptive alt text.

#TODO 17c. Test: Confirm colour contrast meets WCAG AA standards.

#TODO 17d. Test: Confirm screen reader compatibility across all major features.

#TODO 17e. Test: Confirm captions/transcripts are available for video content.

## 18. Performance & Technical Polish

#TODO 18a. Test: Audit page load times and optimise images, bundles, and critical paths.

#TODO 18b. Test: Confirm all forms validate clearly and provide helpful error messages.

#TODO 18c. Test: Confirm all transitions and animations are smooth and performant (no jank).

#TODO 18d. Test: Confirm offline handling and error states are graceful across all pages.

## 19. Documentation & Help

#TODO 19a. Feat: Add inline help tooltips or info icons where UX is non-obvious (e.g., IPFS node, voting, data export).

#TODO 19b. Feat: Create a Help or FAQ page addressing common questions about governance, data, peership, and technical features.

## 20. Final Verification

#TODO 20a. Test: Full end-to-end user journey from landing page through registration, onboarding, learning a path, reflecting, creating, connecting, and participating in governance.

#TODO 20b. Test: Verify all promises made on Home/About pages are fulfilled in the product experience.

#TODO 20c. Test: Confirm all TODOs across Iterations 1, 2, and 3 are complete or explicitly deferred with reason.

---

## Success Criteria for "Final Iteration"

- Every page is professional, polished, and complete.
- User can understand SOAR's mission and value within 2 minutes on the site.
- User can complete a full learning path → reflect → create → share → connect journey end-to-end.
- All governance, data ownership, and peership language is consistent and clear.
- Accreditation system reassures peers that learning is credible and valuable.
- No prototype language, placeholder copy, or unfinished UI.
- Platform is accessible, performant, and handles edge cases gracefully.

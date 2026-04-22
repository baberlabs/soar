# SOAR Web App

SOAR is a React + Vite prototype for a calmer, peer-oriented learning product.

The current build focuses on a truthful first-peer flow:

- Create an account
- Complete onboarding
- Start a subject path and complete guided sessions
- Save creations and reflections
- Vote in the forum
- Connect with a peer

This is a local-first prototype. Accounts, progress, creations, reflections, and dispatch signups are stored in browser storage for the current device. The app does **not** process real payments or implement portable peer-owned storage yet.

## Run locally

```bash
git clone https://github.com/baberlabs/soar.git
cd soar
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run lint` runs ESLint
- `npm run preview` serves the production build locally

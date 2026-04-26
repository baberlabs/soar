import LogoIcon from "../assets/icons";

export const AppLoadingScreen = () => (
  <main className="flex min-h-dvh items-center justify-center bg-page px-6 text-brand">
    <div
      className="flex flex-col items-center gap-4 motion-safe:animate-pulse"
      role="status"
      aria-live="polite"
    >
      <img className="h-16 w-auto" src={LogoIcon} alt="" aria-hidden="true" />
      <p className="font-ui text-sm tracking-[0.14em] text-brand/62">
        Loading SOAR
      </p>
    </div>
  </main>
);

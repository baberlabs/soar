import { Link } from "react-router-dom";

import { getButtonClasses } from "../../components/buttonStyles";
import { useSOARState } from "../../hooks/useSOARState";

export default function NotFound() {
  const [state] = useSOARState();

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-360 items-center px-6 py-24">
      <section className="mx-auto max-w-3xl rounded-4xl border border-brand/15 bg-white/75 p-8 text-center shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-10">
        <p className="font-ui text-sm tracking-[0.18em] text-brand/55">404</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,8vw,5rem)] leading-[0.92] text-brand">
          That page has drifted off course.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-brand/78 md:text-lg">
          The link may be old, or the route may never have existed. The main
          paths are below so you can get back to something useful quickly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={state.user ? "/learn" : "/"}
            className={getButtonClasses({
              variant: "primary",
              fullWidth: false,
            })}
          >
            {state.user ? "Go To Learn" : "Go Home"}
          </Link>
          <Link
            to="/about"
            className={getButtonClasses({
              variant: "secondary",
              fullWidth: false,
            })}
          >
            Read About SOAR
          </Link>
        </div>
      </section>
    </main>
  );
}

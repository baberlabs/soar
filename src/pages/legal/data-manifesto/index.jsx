import { Link } from "react-router-dom";
import { LinkButton } from "../../../components/LinkButton";

export default function DataManifesto() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 md:gap-16">
        <header className="space-y-6">
          <p className="font-ui text-sm tracking-[0.24em] text-brand/60">
            TRANSPARENCY
          </p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] text-brand">
            The Data Manifesto.
          </h1>
          <p className="max-w-2xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
            Most platforms extract your data to sell your attention. SOAR is
            built so your data remains entirely yours. This isn't a standard
            privacy policy; it's a declaration of ownership.
          </p>
        </header>

        <section className="space-y-6 rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-10">
          <h2 className="font-ui text-3xl text-brand">Zero Extraction</h2>
          <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            <p>
              SOAR does not run ads. We do not use engagement algorithms to
              manipulate your behaviour. Therefore, we have no financial
              incentive to harvest or sell your personal data.
            </p>
            <p>
              We only collect what is strictly necessary to keep your account
              functional and your learning history secure.
            </p>
          </div>
        </section>

        <section className="space-y-6 rounded-4xl border border-brand/12 bg-page p-7 md:p-10">
          <h2 className="font-ui text-3xl text-brand">
            Decentralised Node Architecture
          </h2>
          <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            <p>
              When you join SOAR, your data isn't dumped into a central
              corporate server. Instead, you are assigned a decentralised node
              (utilising IPFS-style distributed storage).
            </p>
            <ul className="space-y-3 pt-2">
              <Bullet text="Your learning progress, creations, and reflections live in your node." />
              <Bullet text="You control the sharing parameters of your node." />
              <Bullet text="Because it is content-addressed, there is no single point of failure or central control." />
            </ul>
          </div>
        </section>

        <section className="space-y-6 rounded-4xl border border-brand/12 bg-brand/5 p-7 md:p-10">
          <h2 className="font-ui text-3xl text-brand">Absolute Portability</h2>
          <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            <p>
              Because your data is your property, you have the right to take it
              with you. Through your Account settings, you can export your
              entire SOAR history (profile, learning paths, creations, and
              connections) as a clean JSON file at any time.
            </p>
          </div>
          <LinkButton
            text="Join SOAR (£1) and Reclaim Your Data"
            href="/join"
            fullWidth={false}
          />
        </section>
      </div>
    </main>
  );
}

const Bullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
      {text}
    </span>
  </li>
);

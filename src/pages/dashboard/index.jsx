import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useSOARState } from "../../store";

import { NodeStatusWidget } from "./components/NodeStatusWidget";
import { CurriculumWidget } from "./components/CurriculumWidget";
import { VisionBoardWidget } from "./components/VisionBoardWidget";
import { MonthlyLetterWidget } from "./components/MonthlyLetterWidget";
import { ForumActivityWidget } from "./components/ForumActivityWidget";
import { RecentCreationsWidget } from "./components/RecentCreationsWidget";

export default function Dashboard() {
  const state = useSOARState();

  const greeting = useMemo(getTimeBasedGreeting, []);
  const firstName = useMemo(() => deriveFirstName(state.user), [state.user]);

  // Defensive guard. ProtectedRoute should already enforce this, but the
  // dashboard accesses user fields throughout the widgets, so a hard
  // redirect is cleaner than null-checking everywhere.
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="font-ui text-sm tracking-[0.16em] text-brand/55">
            Dashboard
          </p>
          <h1 className="font-display text-[clamp(3rem,7vw,5rem)] leading-[0.92] text-brand">
            {greeting}, {firstName}.
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/78">
            Pick up your curriculum, capture this month&rsquo;s intentions, and
            stay close to what your peers are building and proposing.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <NodeStatusWidget />
          </div>

          <div className="md:col-span-2">
            <CurriculumWidget />
          </div>

          <VisionBoardWidget />
          <MonthlyLetterWidget />

          <ForumActivityWidget />
          <RecentCreationsWidget />
        </div>
      </div>
    </main>
  );
}

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const deriveFirstName = (user) => {
  if (!user) return "peer";
  if (user.firstName) return user.firstName;
  if (user.name) return String(user.name).split(" ")[0];
  return "peer";
};

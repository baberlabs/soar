import { Navigate } from "react-router-dom";
import { useSOARState } from "../store";

export function ProtectedRoute({ children, requireOnboarding = true }) {
  const state = useSOARState();
  const isAuthenticated = state.user !== null;
  const isOnboarded = state.user?.onboardingComplete === true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

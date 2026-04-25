import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Header } from "./layout/Header";
import { Newsletter } from "./layout/Newsletter";
import { Donation } from "./layout/Donation";
import { Footer } from "./layout/Footer";
import { PageSkeleton } from "./components/PageSkeleton";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { useSOARState } from "./store";

const About = lazy(() => import("./pages/about"));

const Account = lazy(() => import("./pages/account"));
const AccountProfileTab = lazy(() => import("./pages/account/tabs/ProfileTab"));
const AccountActivityTab = lazy(
  () => import("./pages/account/tabs/ActivityTab"),
);
const AccountPeersTab = lazy(() => import("./pages/account/tabs/PeersTab"));
const AccountNodeTab = lazy(() => import("./pages/account/tabs/NodeTab"));
const AccountDataTab = lazy(() => import("./pages/account/tabs/DataTab"));
const AccountComingSoonTab = lazy(
  () => import("./pages/account/tabs/ComingSoonTab"),
);

const Connect = lazy(() => import("./pages/connect"));
const ChatsTab = lazy(() => import("./pages/connect/tabs/ChatsTab"));
const MyPeersTab = lazy(() => import("./pages/connect/tabs/MyPeersTab"));
const FindPeersTab = lazy(() => import("./pages/connect/tabs/FindPeersTab"));
const MyEventsTab = lazy(() => import("./pages/connect/tabs/MyEventsTab"));
const AllEventsTab = lazy(() => import("./pages/connect/tabs/AllEventsTab"));

const Create = lazy(() => import("./pages/create"));
const CreationDetail = lazy(
  () => import("./pages/create/detail/CreationDetail"),
);

const Dashboard = lazy(() => import("./pages/dashboard"));
const Donate = lazy(() => import("./pages/donate"));

const Forum = lazy(() => import("./pages/forum"));
const ForumFilteredListTab = lazy(
  () => import("./pages/forum/tabs/FilteredListTab"),
);
const ForumDraftsTab = lazy(() => import("./pages/forum/tabs/DraftsTab"));
const ForumNewProposalTab = lazy(
  () => import("./pages/forum/tabs/NewProposalTab"),
);
const ForumProposalDetail = lazy(
  () => import("./pages/forum/detail/ProposalDetail"),
);
const ForumProposalEdit = lazy(
  () => import("./pages/forum/detail/ProposalEdit"),
);

const Home = lazy(() => import("./pages/home"));
const Join = lazy(() => import("./pages/join"));
const Learn = lazy(() => import("./pages/learn"));
const Login = lazy(() => import("./pages/login"));
const MonthlyLetter = lazy(() => import("./pages/monthly-letter"));
const NotFound = lazy(() => import("./pages/not-found"));
const Onboarding = lazy(() => import("./pages/onboarding"));
const Session = lazy(() => import("./pages/session"));
const Subject = lazy(() => import("./pages/subject"));
const VisionBoard = lazy(() => import("./pages/vision-board"));

const DataManifesto = lazy(() => import("./pages/legal/data-manifesto"));
const Terms = lazy(() => import("./pages/legal/terms"));
const Accessibility = lazy(() => import("./pages/legal/accessibility"));

/**
 * Root route. Authenticated peers land on the Dashboard; everyone else
 * gets the marketing Home page. The redirect is rendered (not pushed),
 * so the back button still behaves naturally.
 */
const RootRoute = () => {
  const { user } = useSOARState();
  return user ? <Navigate to="/dashboard" replace /> : <Home />;
};

const App = () => {
  const location = useLocation();
  const showDonation = location.pathname !== "/donate";

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-page text-navy">
      <ScrollToTop />
      <Header />

      <div className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<RootRoute />} />
            <Route path="/about" element={<About />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/donate" element={<Donate />} />
            {/* Legal & Transparency */}
            <Route path="/data-manifesto" element={<DataManifesto />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/accessibility" element={<Accessibility />} />
            {/* Auth flows */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            {/* Protected platform pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn"
              element={
                <ProtectedRoute>
                  <Learn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId"
              element={
                <ProtectedRoute>
                  <Subject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId/sessions/:lessonId"
              element={
                <ProtectedRoute>
                  <Session />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create/:creationId"
              element={
                <ProtectedRoute>
                  <CreationDetail />
                </ProtectedRoute>
              }
            />
            {/* Reflection: split into Vision Board + Monthly Letter (spec 8.11/8.12) */}
            <Route
              path="/vision-board"
              element={
                <ProtectedRoute>
                  <VisionBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-letter"
              element={
                <ProtectedRoute>
                  <MonthlyLetter />
                </ProtectedRoute>
              }
            />
            {/* /reflect is a legacy alias, keep it working for any saved links. */}
            <Route
              path="/reflect"
              element={<Navigate to="/vision-board" replace />}
            />

            {/* Connect: shell + nested tabs  */}
            <Route
              path="/connect"
              element={
                <ProtectedRoute>
                  <Connect />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="chats" replace />} />
              <Route path="chats" element={<ChatsTab />} />
              <Route path="my-peers" element={<MyPeersTab />} />
              <Route path="find-peers" element={<FindPeersTab />} />
              <Route path="my-events" element={<MyEventsTab />} />
              <Route path="all-events" element={<AllEventsTab />} />
            </Route>

            {/* Account: shell + nested tabs */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<AccountProfileTab />} />
              <Route path="activity" element={<AccountActivityTab />} />
              <Route path="peers" element={<AccountPeersTab />} />
              <Route path="node" element={<AccountNodeTab />} />
              <Route path="data" element={<AccountDataTab />} />
              <Route path="coming-soon" element={<AccountComingSoonTab />} />
            </Route>
            <Route
              path="/forum"
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="all" replace />} />
              <Route
                path="all"
                element={<ForumFilteredListTab routeFilter="all" />}
              />
              <Route
                path="discussion"
                element={<ForumFilteredListTab routeFilter="discussion" />}
              />
              <Route
                path="voting"
                element={<ForumFilteredListTab routeFilter="voting" />}
              />
              <Route
                path="closed"
                element={<ForumFilteredListTab routeFilter="closed" />}
              />
              <Route path="new" element={<ForumNewProposalTab />} />
              <Route path="drafts" element={<ForumDraftsTab />} />
              <Route path=":proposalId/edit" element={<ForumProposalEdit />} />
              <Route path=":proposalId" element={<ForumProposalDetail />} />
            </Route>
            {/* /feedback is a legacy alias for /forum, keep it working */}
            <Route
              path="/feedback"
              element={<Navigate to="/forum/all" replace />}
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {showDonation && <Donation />}
      <Newsletter />
      <Footer />
    </div>
  );
};

export default App;

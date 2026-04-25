import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Header } from "./layout/Header";
import { Newsletter } from "./layout/Newsletter";
import { Donation } from "./layout/Donation";
import { Footer } from "./layout/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";

import About from "./pages/about";

import Account from "./pages/account";
import AccountProfileTab from "./pages/account/tabs/ProfileTab";
import AccountActivityTab from "./pages/account/tabs/ActivityTab";
import AccountPeersTab from "./pages/account/tabs/PeersTab";
import AccountNodeTab from "./pages/account/tabs/NodeTab";
import AccountDataTab from "./pages/account/tabs/DataTab";
import AccountComingSoonTab from "./pages/account/tabs/ComingSoonTab";

import Connect from "./pages/connect";
import ChatsTab from "./pages/connect/tabs/ChatsTab";
import MyPeersTab from "./pages/connect/tabs/MyPeersTab";
import FindPeersTab from "./pages/connect/tabs/FindPeersTab";
import MyEventsTab from "./pages/connect/tabs/MyEventsTab";
import AllEventsTab from "./pages/connect/tabs/AllEventsTab";

import Create from "./pages/create";
import Dashboard from "./pages/dashboard";
import Donate from "./pages/donate";

import Forum from "./pages/forum";
import ForumFilteredListTab from "./pages/forum/tabs/FilteredListTab";
import ForumDraftsTab from "./pages/forum/tabs/DraftsTab";
import ForumNewProposalTab from "./pages/forum/tabs/NewProposalTab";
import ForumProposalDetail from "./pages/forum/detail/ProposalDetail";
import ForumProposalEdit from "./pages/forum/detail/ProposalEdit";

import Home from "./pages/home";
import Join from "./pages/join";
import Learn from "./pages/learn";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import Onboarding from "./pages/onboarding";
import Reflect from "./pages/reflect";
import Session from "./pages/session";
import Subject from "./pages/subject";

import DataManifesto from "./pages/legal/data-manifesto";
import Terms from "./pages/legal/terms";
import Accessibility from "./pages/legal/accessibility";

const App = () => {
  const location = useLocation();
  const showDonation = location.pathname !== "/donate";

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-page text-navy">
      <ScrollToTop />
      <Header />

      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
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
            path="/reflect"
            element={
              <ProtectedRoute>
                <Reflect />
              </ProtectedRoute>
            }
          />

          {/* Connect: shell + nested tabs */}
          <Route path="/connect" element={<Connect />}>
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
          {/* /feedback is a legacy alias for /forum — keep it working */}
          <Route
            path="/feedback"
            element={<Navigate to="/forum/all" replace />}
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {showDonation && <Donation />}
      <Newsletter />
      <Footer />
    </div>
  );
};

export default App;

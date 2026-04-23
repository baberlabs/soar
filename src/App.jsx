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
import EventsTab from "./pages/connect/tabs/EventsTab";
import ConnectPeersTab from "./pages/connect/tabs/PeersTab";
import Create from "./pages/create";
import Dashboard from "./pages/dashboard";
import Donate from "./pages/donate";
import Forum from "./pages/forum";
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
          <Route
            path="/connect"
            element={
              <ProtectedRoute>
                <Connect />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="peers" replace />} />
            <Route path="peers" element={<ConnectPeersTab />} />
            <Route path="chats" element={<ChatsTab />} />
            <Route path="events" element={<EventsTab />} />
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
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
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

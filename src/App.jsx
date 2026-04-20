import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import { Header } from "./layout/Header";
import { Newsletter } from "./layout/Newsletter";
import { Donation } from "./layout/Donation";
import { Footer } from "./layout/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

import About from "./pages/about";
import Account from "./pages/account";
import Connect from "./pages/connect";
import ChatsTab from "./pages/connect/tabs/ChatsTab";
import EventsTab from "./pages/connect/tabs/EventsTab";
import PeersTab from "./pages/connect/tabs/PeersTab";
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

const App = () => {
  const location = useLocation();
  const showDonation = location.pathname !== "/donate";

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-page text-navy">
      <Header />

      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<Donate />} />

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

          <Route
            path="/connect"
            element={
              <ProtectedRoute>
                <Connect />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="peers" replace />} />
            <Route path="peers" element={<PeersTab />} />
            <Route path="chats" element={<ChatsTab />} />
            <Route path="events" element={<EventsTab />} />
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
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
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

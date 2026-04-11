import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./layout/Header";
import { Newsletter } from "./layout/Newsletter";
import { Footer } from "./layout/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Home } from "./pages/home";
import { About } from "./pages/about/About";
import { Join } from "./pages/join/Join";
import { Login } from "./pages/login/Login";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { Account } from "./pages/account/Account";
import { Dashboard } from "./pages/dashboard";
import { Create } from "./pages/create";
import { Learn, SubjectRoom } from "./pages/learn";
import { Reflect } from "./pages/reflect";
import { Connect } from "./pages/connect";
import { Forum } from "./pages/forum";
import { PrinciplePage } from "./pages/principles/PrinciplePage";
import { NotFound } from "./pages/not-found/NotFound";

const App = () => (
  <BrowserRouter>
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-page text-navy">
      <Header />

      <div className="flex-1">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/principles/no-scroll"
            element={<PrinciplePage slug="no-scroll" />}
          />
          <Route
            path="/principles/data-ownership"
            element={<PrinciplePage slug="data-ownership" />}
          />
          <Route
            path="/principles/governance"
            element={<PrinciplePage slug="governance" />}
          />

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
                <SubjectRoom />
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
          />
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

      <Newsletter />
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;

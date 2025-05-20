import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserAccountPage from "./pages/UserAccountPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ReportDetailPage from "./pages/ReportDetailPage";
import VerificationPage from "./pages/VerificationPage";
import RedirectOnStart from "./components/RedirectOnStart";
import "./App.css";
import AdminPanel from "./components/AdminPanel";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectOnStart />} />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/verification"
          element={
            <Layout>
              <VerificationPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignUpPage />
            </Layout>
          }
        />
        <Route
          path="/userAccount"
          element={
            <ProtectedRoute>
              <Layout>
                <UserAccountPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/userAccount/:reportId"
          element={
            <ProtectedRoute>
              <Layout>
                <ReportDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminPanel"
          element={
            <AdminRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserAccountPage from "./pages/UserAccountPage";
import VerificationPage from "./pages/VerificationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
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
        <Route path="/verification" element={<VerificationPage />} />
      </Routes>
    </Router>
  );
}

export default App;

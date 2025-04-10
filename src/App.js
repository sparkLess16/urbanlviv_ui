import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserAccountPage from "./pages/UserAccountPage";
import VerificationPage from "./pages/VerificationPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/useraccount" element={<UserAccountPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Routes>
    </Router>
  );
}

export default App;

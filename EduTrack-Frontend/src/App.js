import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  const [page, setPage] = useState("landing");
  const [role, setRole] = useState("student");
  const [user, setUser] = useState(null);

  // Push a history entry whenever page changes (except dashboard — no back from there)
  const navigate = (newPage) => {
    window.history.pushState({ page: newPage }, "", `#${newPage}`);
    setPage(newPage);
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePop = (e) => {
      const p = e.state?.page || "landing";
      // Don't allow back into dashboard
      if (p === "dashboard") return;
      setPage(p);
    };
    // Set initial history state
    window.history.replaceState({ page: "landing" }, "", "#landing");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const handleLogin  = (r, data) => { setRole(r); setUser(data); setPage("dashboard"); };
  const handleSignup = (r, data) => { setRole(r); setUser(data); setPage("dashboard"); };
  const handleLogout = () => { setRole("student"); setUser(null); navigate("landing"); };

  return (
    <ThemeProvider>
      {(() => {
        switch (page) {
          case "landing":
            return <LandingPage onGoSignin={() => navigate("login")} onGoSignup={() => navigate("signup")} />;
          case "login":
            return <Login onLogin={handleLogin} onGoSignup={() => navigate("signup")} onGoForgotPassword={() => navigate("forgot-password")} />;
          case "signup":
            return <Signup onSignup={handleSignup} onGoLogin={() => navigate("login")} />;
          case "forgot-password":
            return <ForgotPassword onGoBack={() => navigate("login")} />;
          case "dashboard":
            return <Dashboard role={role} user={user} onLogout={handleLogout} />;
          default:
            return <LandingPage onGoSignin={() => navigate("login")} onGoSignup={() => navigate("signup")} />;
        }
      })()}
    </ThemeProvider>
  );
}

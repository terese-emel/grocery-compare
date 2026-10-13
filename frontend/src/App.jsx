import { useState } from "react";
import AuthForm from "./components/AuthForm";
import AuthenticatedApp from "./components/AuthenticatedApp";
import { useAuth } from "./context/authContextValue";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const { user, isAuthLoading, logout } = useAuth();

  if (isAuthLoading) {
    return <p>Loading session...</p>;
  }

  if (!user) {
    return (
      <main>
        <h1>Grocery Compare</h1>
        <AuthForm mode={authMode} />
        <button
          className="button-secondary auth-switch"
          type="button"
          onClick={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
        >
          {authMode === "login"
            ? "Create a new account"
            : "I already have an account"}
        </button>
      </main>
    );
  }

  return <AuthenticatedApp user={user} logout={logout} />;
}

export default App;

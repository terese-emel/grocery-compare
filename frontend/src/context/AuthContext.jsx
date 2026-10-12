import { useEffect, useState } from "react";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../services/authApi";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email, password) {
    const data = await loginRequest(email, password);
    setUser(data.user);
    return data.user;
  }

  async function register(email, password) {
    const data = await registerRequest(email, password);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    void logoutRequest().catch(() => {});
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

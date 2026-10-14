import { useEffect, useState } from "react";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "./authApi";
import { AuthContext } from "./authContext";

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

  async function logout() {
    try {
      await logoutRequest();
    } catch {
      // Server error: proceed with local sign-out; the cookie will expire on its own.
    }
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

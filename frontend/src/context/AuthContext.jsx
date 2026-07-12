import { createContext, useCallback, useContext, useState } from "react";

/**
 * AuthContext
 * Provides authentication state to every component in the tree.
 *
 * Why Context instead of prop-drilling?
 * The Navbar, Login Modal, Register Modal, Dashboard, and every protected
 * route all need to know if the user is logged in. Passing this down as
 * props through every intermediate component (prop-drilling) creates
 * maintenance problems. Context makes it available anywhere with one import.
 *
 * Storage keys use a 'qg_' prefix to avoid collisions with other sites'
 * localStorage entries if the user has multiple apps open.
 */

const KEYS = {
  user: "qg_user",
  accessToken: "qg_access_token",
  refreshToken: "qg_refresh_token",
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialise from localStorage so the session survives a page refresh.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.user)) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem(KEYS.accessToken) || null,
  );

  /**
   * Call this after a successful login or registration API response.
   * Stores everything in both state and localStorage.
   */
  const login = useCallback((userData, accessToken, refreshToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem(KEYS.user, JSON.stringify(userData));
    localStorage.setItem(KEYS.accessToken, accessToken);
    localStorage.setItem(KEYS.refreshToken, refreshToken);
  }, []);

  /**
   * Call this when the user clicks Logout or when a 401 is received.
   * Clears both state and localStorage.
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth — consume the auth context from any component.
 * Throws if called outside <AuthProvider> to catch wiring mistakes early.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be called inside <AuthProvider>");
  return ctx;
};

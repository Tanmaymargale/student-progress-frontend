import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("spms_auth") === "true";
  });
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const u = localStorage.getItem("spms_user");
    return u ? JSON.parse(u) : null;
  });

  const login = (email: string, _password: string) => {
    const userData = { name: email.split("@")[0], email };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("spms_auth", "true");
    localStorage.setItem("spms_user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("spms_auth");
    localStorage.removeItem("spms_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

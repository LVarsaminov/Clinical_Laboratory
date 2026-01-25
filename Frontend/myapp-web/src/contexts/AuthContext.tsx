import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  userRole: string | null;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const decodeToken = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const decoded = JSON.parse(atob(parts[1]));
        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const id = decoded.sub || decoded.nameid;
        setUserRole(role);
        setUserId(id);
        return { role, id };
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }
    return { role: null, id: null };
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      decodeToken(savedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
    decodeToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, currentUser, setCurrentUser, userRole, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

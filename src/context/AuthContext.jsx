import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../utils/token";

// Helper: decode JWT payload
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(() => {
    // Khởi tạo user từ token đã lưu (nếu có)
    const savedToken = getToken();
    if (savedToken) {
      const payload = parseJwt(savedToken);
      if (payload && payload.exp * 1000 > Date.now()) {
        return payload;
      }
    }
    return null;
  });

  const login = (newToken) => {
    saveToken(newToken);
    setToken(newToken);
    setUser(parseJwt(newToken));
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
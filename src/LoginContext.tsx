import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface LoginContextProps {
  isLoggedIn: boolean;
  username: string;
  login: (user: string) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const useLogin = (): LoginContextProps => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  const login = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    if (storedLoginState === "true" && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
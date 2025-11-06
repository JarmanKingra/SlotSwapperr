import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../config/index.jsx";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
     setLoading(false);
  }, []);

  const handleSignUp = async (name, email, password) => {
    try {
      let response = await client.post("/signUp", {
        name: name,
        email: email,
        password: password,
      });

      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user ?? null);
        setIsLoggedIn(true);
        router("/dashboard");
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      let response = await client.post("/login", {
        email: email,
        password: password,
      });

      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user ?? null);
        setIsLoggedIn(true);
        router("/dashboard");
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsLoggedIn(false);
    router("/auth");
  };

  const data = {
    userData,
    isLoggedIn,
    handleLogin,
    handleSignUp,
    loading,
    handleLogout
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

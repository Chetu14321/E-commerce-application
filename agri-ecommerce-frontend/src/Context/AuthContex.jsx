import React, { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Create context for authentication
export const AuthContext = createContext();

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(false); // Track login status
  const [token, setToken] = useState(null); // Store the token
  const [user, setUser] = useState(null); // Store user data

  // Verify the token
  const verifyToken = useCallback(async () => {
    if (token) {
      try {
        const res = await axios.get(`/api/users/verify`, {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        });
        toast.success(res.data.msg);
        setUser(res.data.user);
        setIsLogin(true); // User is logged in
      } catch (err) {
        toast.error(err.response?.data?.msg || "Token verification failed.");
        setIsLogin(false); // User is not logged in
      }
    } else {
      setIsLogin(false); // No token, user is not logged in
    }
  }, [token]);

  // Check if token exists on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Check for token in localStorage
    if (storedToken) {
      setToken(storedToken); // Set token from localStorage
    }
  }, []);

  // Re-verify the token when it changes
  useEffect(() => {
    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLogin, token, setToken, setIsLogin, user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}

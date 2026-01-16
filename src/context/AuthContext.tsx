"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { signInRequest, getProfileRequest, updateProfileRequest, changePasswordRequest } from "../services/authService";

type User = any;

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: any) => Promise<any>;
  changePassword: (payload: any) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!token) return setLoading(false);
      setLoading(true);
      try {
        const res = await getProfileRequest(token);
        if (res && res.data && res.data.admin) {
          setUser(res.data.admin);
        } else if (res && res.admin) {
          setUser(res.admin);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [token]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await signInRequest(email, password);
      if (res && (res.data?.token || res.data?.token || res.token)) {
        const tokenValue = res.data?.token || res.token;
        localStorage.setItem("token", tokenValue);
        setToken(tokenValue);
        // fetch profile
        const profile = await getProfileRequest(tokenValue);
        const userData = profile?.data?.admin || profile?.admin || profile?.data;
        setUser(userData || null);
        return { success: true };
      }
      const message = res?.message || "Invalid credentials";
      setError(message);
      return { success: false, message };
    } catch (err: any) {
      console.error(err);
      const message = err?.message || "Sign in failed";
      setError(message);
      return { success: false, message };
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await getProfileRequest(token);
      const userData = profile?.data?.admin || profile?.admin || profile?.data;
      setUser(userData || null);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (payload: any) => {
    if (!token) throw new Error("No token");
    const res = await updateProfileRequest(token, payload);
    if (res && (res.success || res.data)) {
      await refreshProfile();
    }
    return res;
  };

  const changePassword = async (payload: any) => {
    if (!token) throw new Error("No token");
    const res = await changePasswordRequest(token, payload);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signIn, signOut, refreshProfile, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

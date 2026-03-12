"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  register as registerApi,
  login as loginApi,
  logoutApi,
  getProfile,
} from "../services/auth.service";
import Swal from "sweetalert2";
import type { User, UserRole } from "../types/user";
type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNo: string;
  IdNo: string;
  role: UserRole;
};
interface AuthContextType {
  user: User | null;
  loading: boolean;
  registerUser: (payload: RegisterPayload) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return; 
    }
    try {
      const res = await getProfile(); 
      if (res.success) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn("Session expired. Please login again.");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  initAuth();
}, []);
  const getRedirectPath = (role?: UserRole) => {
    switch (role) {
      case "admin":
        return "/dashboard";
      case "staff":
        return "/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };
  const registerUser = async (payload: RegisterPayload) => {
    const res = await registerApi(payload);
    if (res.token) {
      localStorage.setItem("token", res.token);
    }
    setUser(res.user);
    router.replace(getRedirectPath(res.user.role));
  };
const loginUser = async (email: string, password: string) => {
  try {
    const res = await loginApi({ email, password });
    const data = res.data; 
 
if (data.token) {
  localStorage.setItem("token", data.token); 
}
    setUser(data.user);
    const role = data.user.role;
    let path = "/dashboard"; 
    if (role === "student") {
      path = "/dashboard/student"; 
    }
    router.replace(path);

  } catch (error: any) {
    console.error("Login Error:", error);
    throw error;
  }
};
  const logoutUser = async () => {
    await logoutApi();
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
    Swal.fire("Logged Out", "You have been logged out successfully", "success");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
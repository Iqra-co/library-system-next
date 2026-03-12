"use client";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized"); 
    }
  }, [user, loading, router]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return user ? <>{children}</> : null;
}

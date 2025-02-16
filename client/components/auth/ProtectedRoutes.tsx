import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  console.log(token, user, loading);
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    // if (!loading && token && !allowedRoles.includes(user.role)) {
    //   router.push("/unauthorized");
    // }
  }, [loading, user, router, allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!user || !allowedRoles.includes(user.role)) {
  //   return null;
  // }

  return <>{children}</>;
}

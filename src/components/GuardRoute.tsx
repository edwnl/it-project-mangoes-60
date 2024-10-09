"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPage from "@/components/Loading";
import { message } from "antd";

type GuardOptions = {
  requireAuth?: boolean;
  requireNonAuth?: boolean;
  allowedRoles?: ("admin" | "volunteer")[];
};

// higher-order component that provides access control based on authentication and roles
export function withGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: GuardOptions = {},
) {
  return function GuardedComponent(props: P) {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const {
      requireAuth = false,
      requireNonAuth = false,
      allowedRoles = [],
    } = options;

    // checks if the user meets the required conditions (auth, roles) before rendering the component
    useEffect(() => {
      if (loading || isRedirecting) return;

      const redirect = (path: string) => {
        setIsRedirecting(true);
        router.push(path);
      };

      // if user is not authenticated but required, redirect to login
      if (requireAuth && !user) {
        redirect("/login");
        // if user is authenticated but not allowed (non-auth page), redirect to home
      } else if (requireNonAuth && user) {
        redirect("/");
        // if user's role is not allowed, show an error and redirect to home
      } else if (
        user &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userRole as "admin" | "volunteer")
      ) {
        message.error("No access.");
        redirect("/");
      } else {
        setIsRedirecting(false);
      }
    }, [
      user,
      userRole,
      loading,
      router,
      requireAuth,
      requireNonAuth,
      allowedRoles,
      isRedirecting,
    ]);

    // if the user is still loading or in the process of redirecting, show a loading page
    if (loading || isRedirecting) {
      return <LoadingPage />;
    }

    if (
      (requireAuth && !user) ||
      (requireNonAuth && user) ||
      (user &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userRole as "admin" | "volunteer"))
    ) {
      return null;
    }

    // render the component only if the user meets all conditions
    return <WrappedComponent {...props} />;
  };
}

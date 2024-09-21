"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function RouteGuard({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Using the useAuth hook from centralised auth state (AuthProvider)
  // Added a loading state to handle initial loading state more gracefully, this can be removed later
  const { user, loading } = useAuth();

  useEffect(() => {
    authCheck(pathname);
  }, [pathname, user, loading]);

  function authCheck(url: string) {
    const publicPaths = ["/login", "/signup", "/unauthorized", "/404"];
    const path = url.split("?")[0];

    if (!loading) {
      if (!user && !publicPaths.includes(path || '')) {
        setAuthorized(false);
        // client component
        router.push("/login");
      } else {
        setAuthorized(true);
      }
    }
  }

  // Loading state check, prevents premature redirects while auth state is still being determined
  if (loading) {
    // You can return a loading component here if you want
    return <div>Loading...</div>;
  }

  return authorized ? children : null; // return null to prevent any flash of unauthorised content
}
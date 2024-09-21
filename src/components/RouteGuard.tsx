"use client";
import { useState, useEffect } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";

export { RouteGuard };

function RouteGuard({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // on initial load - run auth check
    authCheck(pathname);
  }, []);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login", "/signup", "/unauthorized", "/404"];
    const path = url.split("?")[0];
    if (!auth.currentUser && path && !publicPaths.includes(path)) {
      setAuthorized(false);
      redirect("/login");
    } else {
      setAuthorized(true);
    }
  }

  return authorized && children;
}

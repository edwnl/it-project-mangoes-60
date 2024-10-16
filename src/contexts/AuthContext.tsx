"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

// Context data
interface AuthContextType {
  user: User | null;
  userRole: string | null;
  userName: string | null;
  userEmail: string | null;
  userFirstName: string | null;
  loading: boolean;
}

// Create the context to hold authentication state that can be accessed throughout the app
const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  userName: null,
  userEmail: null,
  userFirstName: null,
  loading: true,
});

// context provider for managing user authentication and session
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // listens for authentication state changes and updates the user and userRole accordingly
  useEffect(() => {
    // listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        setUserRole(userData?.role || null);
        setUserName(userData?.name || null);
        setUserEmail(firebaseUser.email);

        // Set first name (first word of the full name)
        if (userData?.name) {
          const firstName = userData.name.split(" ")[0];
          setUserFirstName(firstName);
        } else {
          setUserFirstName(null);
        }
      } else {
        setUserRole(null);
        setUserName(null);
        setUserEmail(null);
        setUserFirstName(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    // Provides the current auth state to all children via AuthContext.Provider
    <AuthContext.Provider
      value={{ user, userRole, userName, userEmail, userFirstName, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Manages authentication state.
// Provides centralised place to handle user authentication, role management and loading states.

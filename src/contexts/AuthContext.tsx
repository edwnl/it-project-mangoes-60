"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';

// Context data 
interface AuthContextType {
    user: User | null; 
    userRole: string | null; 
    loading: boolean; 
}

// Create the context to hold authentication state that can be accessed throughout the app 
const AuthContext = createContext<AuthContextType>({ user: null, userRole: null, loading: true});

// Component that wrapts the entire application 
// Manages User, UserRole and Loading states 
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser ] = useState<User | null>(null); 
    const [userRole, setUserRole] = useState<string | null>(null); 
    const [loading, setLoading ] = useState(true); 

    // Listener for authentication state changes 
    useEffect(() => {
        // listen for auth changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser); 
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid)); 
                const userData = userDoc.data(); 
                setUserRole(userData?.role || null); 
            
            } else {
                setUserRole(null);
            }
            setLoading(false); 
        }); 
        
        return () => unsubscribe(); 
    }, []);


    return (
        // Provides the current auth state to all children via AuthContext.Provider
        <AuthContext.Provider value={{user, userRole, loading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext); 


// Manages authentication state. 
// Provides centralised place to handle user authentication, role management and looading states. 
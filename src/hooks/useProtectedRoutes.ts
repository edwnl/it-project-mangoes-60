import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';

export function useProtectedRoute(allowedRoles: string[]) {
    const router = useRouter(); 
    const [isAuthorised, setIsAuthorised] = useState(false); // state variable to track user access
    const [isLoading, setIsLoading] = useState(true); // state variable that tracks loading state of the hook 

    useEffect(() => {
        // Firebase Authentication Listener 
        // Listener to detect authentication state changes (e.g. when a user signs in, out or when app first loads)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid)); 
                const userData = userDoc.data(); 
                // Authorisation check 
                if (userData && allowedRoles.includes(userData.role)) {
                    setIsAuthorised(true); 
                } else {
                    router.push('/unauthorised');
                }
            } else {
                // Redirect if user is not logged in
                router.push('/login');
            }
            setIsLoading(false); 
        }); 
        // clean up function that unsubscribes the authentication listener when the component unmounts. 
        return () => unsubscribe(); 
    }, [router, allowedRoles]);

    return { isAuthorised, isLoading };
}


// This hook manages route protection based on user roles. 
// Current user is managed through Firebase Authentication
/*
It automatically tracks the authentication state of the user in the application 
When a user signs in, Firebase stores the user's session

When a user is authenticated, onAuthStateChanged provides a user object that contains detilas about the currently logged-in user. 

*/

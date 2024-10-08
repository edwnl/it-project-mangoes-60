"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebaseClient";
import { UserData } from "@/types/types";
import { sendInvitationEmail } from "@/lib/emailService";
import { createUserWithEmailAndPassword } from "@firebase/auth";

// fetches all users from the "users" collection in Firestore
export const fetchAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as UserData,
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

// creates an invitation document in Firestore and sends an invitation email
export const createInvitation = async (
  email: string,
  role: "volunteer" | "admin",
): Promise<string> => {
  try {
    const invitationsCollection = collection(db, "invitations");
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days from now

    const docRef = await addDoc(invitationsCollection, {
      email,
      role,
      expirationDate: Timestamp.fromDate(expirationDate),
      used: false,
    });

    // Send invitation email
    await sendInvitationEmail(
      email,
      `https://it-proj-midsem-sprint.vercel.app/signup/${docRef.id}`,
    );

    return docRef.id;
  } catch (error) {
    console.error("Error creating invitation:", error);
    throw new Error("Failed to create invitation");
  }
};

// validates the invitation by checking its existence and expiration
export const validateInvitation = async (
  invitationId: string,
): Promise<{ email: string; role: "volunteer" | "admin" } | null> => {
  try {
    const invitationRef = doc(db, "invitations", invitationId);
    const invitationSnap = await getDoc(invitationRef);

    if (!invitationSnap.exists()) {
      return null;
    }

    const invitation = invitationSnap.data();
    const now = new Date();

    if (invitation.used || invitation.expirationDate.toDate() < now) {
      return null;
    }

    return { email: invitation.email, role: invitation.role };
  } catch (error) {
    console.error("Error validating invitation:", error);
    return null;
  }
};

// creates a new user in Firebase Authentication and Firestore using the invitation details
export const createUser = async (
  invitationId: string,
  name: string,
  password: string,
): Promise<string> => {
  try {
    const invitation = await validateInvitation(invitationId);
    if (!invitation) {
      throw new Error("Invalid or expired invitation");
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      invitation.email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Create user document in Firestore with UID as document ID
    const userDocRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userDocRef, {
      email: invitation.email,
      name,
      role: invitation.role,
    });

    // Mark invitation as used
    const invitationRef = doc(db, "invitations", invitationId);
    await updateDoc(invitationRef, { used: true });

    return firebaseUser.uid;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// deletes expired invitations from Firestore
export const deleteExpiredInvitations = async (): Promise<void> => {
  try {
    const invitationsCollection = collection(db, "invitations");
    const now = new Date();
    const expiredInvitationsQuery = query(
      invitationsCollection,
      where("expirationDate", "<", now),
      where("used", "==", false),
    );

    const expiredInvitationsSnapshot = await getDocs(expiredInvitationsQuery);

    const deletePromises = expiredInvitationsSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref),
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting expired invitations:", error);
  }
};

// updates the user document in Firestore with new data
export const updateUser = async (
  userId: string,
  updateData: Partial<UserData>,
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

// fetches a specific user's data from Firestore using their ID
export const fetchUserData = async (
  user_id: string,
): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", user_id);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error(`No user with the ID ${user_id}!`);
      return null;
    }

    const data: DocumentData = userDocSnap.data();

    return data as UserData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

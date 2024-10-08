"use client";

import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { UserData } from "@/types/types";
import { sendInvitationEmail } from "@/lib/emailService";

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


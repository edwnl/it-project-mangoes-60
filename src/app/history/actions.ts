"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { SearchHistory, UserData } from "@/types/types";

import { fetchUserData } from "@/app/accounts/actions";

// fetches all the history records for a specific user
export const fetchHistoryRecords = async (
  userId: string,
): Promise<SearchHistory[]> => {
  try {
    const historyCollection = collection(db, "scanHistory");
    let q = query(historyCollection, orderBy("timestamp", "desc"), limit(50));

    const userData = await fetchUserData(userId);
    if (!userData) {
      console.error("Could not fetch user data for userID: " + userId);
      return [];
    }

    if (userData.role === "volunteer") {
      q = query(q, where("user_id", "==", userId));
    }

    const querySnapshot = await getDocs(q);
    const records: SearchHistory[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const historyUserData = await fetchUserData(data.user_id);

        return {
          history_id: doc.id,
          ...(data as SearchHistory),
          timestamp: data.timestamp as Timestamp,
          user_data: {
            ...historyUserData,
            id: data.user_id,
          },
        } as SearchHistory;
      }),
    );

    console.log("Fetched history records:", records);
    return records;
  } catch (error) {
    console.error("Error fetching history records:", error);
    throw new Error(`Failed to load history records ${error}`);
  }
};

// updates a history record with new data (e.g., correct subcategory and quantity)
export const updateHistoryRecord = async (
  recordId: string | null | undefined,
  updatedData: Partial<SearchHistory>,
): Promise<void> => {
  if (!recordId) return;

  try {
    console.log(recordId);
    const recordRef = doc(db, "scanHistory", recordId);
    await updateDoc(recordRef, {
      correct_subcategory_id: updatedData.correct_subcategory_id,
      scanned_quantity: updatedData.scanned_quantity,
    });
  } catch (error) {
    console.error("Error updating history record:", error);
    throw new Error("Failed to update history record");
  }
};

// deletes a specific history record by ID
export const deleteHistoryRecord = async (
  recordId: string | null | undefined,
): Promise<void> => {
  if (!recordId) return;

  try {
    const recordRef = doc(db, "scanHistory", recordId);
    await deleteDoc(recordRef);
  } catch (error) {
    console.error("Error deleting history record:", error);
    throw new Error("Failed to delete history record");
  }
};

// fetches all users from the users collection
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
    throw new Error("Failed to load users");
  }
};

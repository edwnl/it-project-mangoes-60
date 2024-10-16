"use client";

import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { message } from "antd";
import { SearchHistory, UserData } from "@/types/types";
import { fetchUserData } from "@/app/accounts/actions";

// update the correct subcategory and quantity in firestore
export const updateCorrectSubCategory = async (
  resultId: string,
  correctSubCategory: string,
  quantity: number,
): Promise<boolean> => {
  try {
    const searchDocRef: DocumentReference = doc(db, "scanHistory", resultId);
    await updateDoc(searchDocRef, {
      correct_subcategory_id: correctSubCategory,
      scanned_quantity: quantity,
    });
    return true;
  } catch (error) {
    console.error("Error updating feedback:", error);
    message.error("Failed to submit feedback");
    return false;
  }
};

// fetch search results from firestore
export const fetchSearchResults = async (
  resultId: string,
): Promise<SearchHistory | null> => {
  try {
    const searchDocRef = doc(db, "scanHistory", resultId);
    const searchDocSnap = await getDoc(searchDocRef);

    if (!searchDocSnap.exists()) {
      console.error("No such document!");
      return null;
    }

    const data: DocumentData = searchDocSnap.data();
    const userData: UserData | null = await fetchUserData(data.user_id);

    return {
      ...(data as SearchHistory),
      ...(userData && { user_data: userData, id: data.user_id }),
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return null;
  }
};

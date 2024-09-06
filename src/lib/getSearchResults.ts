import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function getSearchResults(resultId: string) {
  const searchDocRef = doc(db, "searchResults", resultId);
  const searchDocSnap = await getDoc(searchDocRef);

  if (searchDocSnap.exists()) {
    const data = searchDocSnap.data();
    return {
      results: data.results,
      feedback_status: data.feedback_status || "NOT_PROVIDED",
      correct_subcategory: data.correct_subcategory,
      imageUrl: data.imageUrl,
    };
  } else {
    throw new Error("No such document!");
  }
}

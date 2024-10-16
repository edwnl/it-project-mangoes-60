import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Subcategory } from "@/types/types";

// fetches all subcategories from Firestore
export async function getCategoriesServer(): Promise<Subcategory[]> {
  const array: Subcategory[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "subcategories"));
    querySnapshot.forEach((doc) => {
      array.push({ ...(doc.data() as Subcategory), id: doc.id });
    });
    return array;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

// generates an AI prompt based on the available subcategories and selected category
export function generateAIPrompt(
  subcategories: Subcategory[],
  selectedCategory: string | null,
): string {
  const categoryList = subcategories
    .map(
      (item) => `${item.id} - ${item.category_name} - ${item.subcategory_name}`,
    )
    .join("\n");

  let prompt = `
  Analyze the item in this image and match it to the top 4 SUBCATEGORY with % confidence in DESC order.
  ${selectedCategory ? `RETURN STRICTLY ONLY ${selectedCategory}` : ""}
  RETURN STRICTLY WITH ONLY SUBCATEGORIES IN THE LIST BELOW.
  RESPOND ONLY AS VALID JSON [["ID",CONF],["ID",CONF],["ID",CONF],["ID",CONF]]
  Data Format: ID - CATEGORY NAME - SUBCATEGORY NAME`;

  console.log(prompt);

  prompt += categoryList;

  console.log(categoryList);

  return prompt.trim();
}

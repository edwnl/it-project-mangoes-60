"use server";

import OpenAI from "openai";
import { categoryItems } from "@/data/categoryData";
import { adminDb, adminStorage } from "@/api/firebaseAdmin";
import { firestore } from "firebase-admin";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/api/firebaseClient";

export async function imageSearch(
  formData: FormData,
): Promise<{ success: boolean; searchId?: string; error?: string }> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file uploaded" };
  }

  try {
    // Upload image to Firebase Storage as a Blob
    const fileName = `searches/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload the file as a Blob directly
    await uploadBytes(storageRef, file);

    // Get the public download URL for the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    const boxData = categoryItems
      .map((item) => `${item.id}:${item.subcategory_name}`)
      .join(", ");

    const prompt = `
    Boxes: ${boxData}. 
    Analyze the item in this image and match it to the top 3 boxes with % confidence in DESC order. 
    RESPOND ONLY AS VALID JSON "[[ID,CONF],[ID,CONF],[ID,CONF]]"
    `;

    // Send prompt with image URL to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: downloadURL,
              },
            },
          ],
        },
      ],
    });

    if (response.usage) {
      console.log(`Total tokens used: ${response.usage.total_tokens}`);
    }

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    // Extract JSON from the content
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;

    const json_res = JSON.parse(jsonString);
    const topResults = json_res
      .slice(0, 3)
      .map(([id, confidence]: [string, number]) => ({
        id,
        confidence,
      }));

    // Store search results in Firestore
    const searchResultRef = await adminDb.collection("searchResults").add({
      results: topResults,
      imageUrl: downloadURL,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, searchId: searchResultRef.id };
  } catch (error: any) {
    console.error("Error in imageSearch:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

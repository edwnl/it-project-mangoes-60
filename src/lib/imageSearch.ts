"use server";

import OpenAI from "openai";
import { adminDb } from "@/lib/firebaseAdmin";
import { firestore } from "firebase-admin";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebaseClient";
import { generateAIPrompt, getCategoriesServer } from "@/lib/generatePrompt";
import { SearchHistory, Subcategory } from "@/types/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// performs an image search using OpenAI API and stores the results in Firestore
export async function imageSearch(formData: FormData): Promise<{
  success: boolean;
  searchId?: string;
  error?: string;
}> {
  const file = formData.get("file") as File;
  const category_filter = formData.get("category") as string;
  const uid = formData.get("userID") as string;

  if (!file) {
    return { success: false, error: "No file uploaded" };
  }

  try {
    // Start file upload and OpenAI API request concurrently
    const startTime = Date.now();
    const [imageUrl, openAIResponse] = await Promise.all([
      benchmarkFunction(uploadImageToFirebase, file),
      benchmarkFunction(processImageWithOpenAI, openai, file, category_filter),
    ]);
    console.log("OpenAI Response: ", openAIResponse);
    const topResults = parseOpenAIResponse(openAIResponse);

    // create search history object to be stored in Firestore
    const searchHistory: SearchHistory = {
      results: topResults,
      image_url: imageUrl,
      prompt_response: openAIResponse,
      category_filter_name: category_filter,
      timestamp: firestore.FieldValue.serverTimestamp(),
      user_id: uid,
      correct_subcategory_id: topResults[0].id,
      scanned_quantity: 1,
    };

    // Store search results in Firestore
    const searchResultRef = await benchmarkFunction(
      addSearchHistory,
      searchHistory,
    );

    const totalEndTime = Date.now();
    console.log(
      `Total execution time for all operations: ${totalEndTime - startTime} ms`,
    );

    return { success: true, searchId: searchResultRef.id };
  } catch (error: any) {
    console.error("Error in imageSearch:", error);
    return {
      success: false,
      error: error.message || "Could not process that image.",
    };
  }
}

async function addSearchHistory(searchResult: SearchHistory) {
  return await adminDb.collection("scanHistory").add(searchResult);
}

// benchmarks a given function by measuring its execution time
async function benchmarkFunction(fn: Function, ...args: any[]): Promise<any> {
  const startTime = Date.now();
  const result = await fn(...args);
  const endTime = Date.now();
  console.log(
    `${fn.name || "Anonymous function"} total time: ${endTime - startTime} ms`,
  );
  return result;
}

// uploads an image file to Firebase Storage and returns its download URL
async function uploadImageToFirebase(file: File): Promise<string> {
  const fileName = `searches/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// processes the image using OpenAI API to categorize it based on the generated prompt
async function processImageWithOpenAI(
  openai: OpenAI,
  file: File,
  category_filter: string | null,
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  const serverCategoryItems: Subcategory[] = await getCategoriesServer();
  const prompt = generateAIPrompt(serverCategoryItems, category_filter);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  if (
    !response ||
    !response.choices[0] ||
    !response.choices[0].message.content
  ) {
    throw new Error("Invalid or empty response from OpenAI.");
  }

  return response.choices[0].message.content || "";
}

// parses the JSON response from OpenAI API to extract valid category-confidence pairs
function parseOpenAIResponse(content: string): any[] {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : content;

  if (!jsonString) {
    throw new Error("No JSON content found in OpenAI response");
  }

  let json_res;
  try {
    json_res = JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Failed to parse JSON from OpenAI response");
  }

  if (!Array.isArray(json_res) || json_res.length === 0) {
    throw new Error("The image provided can't be categorised.");
  }

  const validResults = json_res.filter(
    (item) =>
      Array.isArray(item) &&
      item.length === 2 &&
      typeof item[0] === "string" &&
      typeof item[1] === "number",
  );

  if (validResults.length === 0) {
    throw new Error(
      "No valid category-confidence pairs found in OpenAI response",
    );
  }

  return validResults.slice(0, 4).map(([id, confidence]: [string, number]) => ({
    id,
    confidence,
  }));
}

"use server";

import OpenAI from "openai";
import { categoryItems } from "@/data/categoryData";
import { adminDb } from "@/lib/firebaseAdmin";
import { firestore } from "firebase-admin";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseClient";

export async function imageSearch(formData: FormData): Promise<{
  success: boolean;
  searchId?: string;
  results?: any[];
  imageUrl?: string;
  error?: string;
}> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file uploaded" };
  }

  try {
    // Start file upload and OpenAI API request concurrently
    const startTime = Date.now();
    const [imageUrl, openAIResponse] = await Promise.all([
      benchmarkFunction(uploadImageToFirebase, file),
      benchmarkFunction(processImageWithOpenAI, openai, file),
    ]);
    const topResults = parseOpenAIResponse(openAIResponse);

    // Store search results in Firestore
    const searchResultRef = await benchmarkFunction(
      storeSearchResultsInFirestore,
      adminDb,
      topResults,
      imageUrl,
      openAIResponse,
    );

    const totalEndTime = Date.now();
    console.log(
      `Total execution time for all operations: ${totalEndTime - startTime} ms`,
    );

    return {
      success: true,
      searchId: searchResultRef.id,
      results: topResults,
      imageUrl,
    };
  } catch (error: any) {
    console.error("Error in imageSearch:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

async function storeSearchResultsInFirestore(
  db: any,
  results: any[],
  imageUrl: string,
  promptResponse: string,
) {
  return await db.collection("searchResults").add({
    results: results,
    imageUrl,
    prompt_response: promptResponse,
    timestamp: firestore.FieldValue.serverTimestamp(),
  });
}

async function benchmarkFunction(fn: Function, ...args: any[]): Promise<any> {
  const startTime = Date.now();
  const result = await fn(...args);
  const endTime = Date.now();
  console.log(
    `${fn.name || "Anonymous function"} total time: ${endTime - startTime} ms`,
  );
  return result;
}

async function uploadImageToFirebase(file: File): Promise<string> {
  const fileName = `searches/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

async function processImageWithOpenAI(
  openai: OpenAI,
  file: File,
): Promise<string> {
  const boxData = categoryItems
    .map((item) => `${item.id}:${item.subcategory_name}`)
    .join(", ");

  const prompt = `
  Boxes: ${boxData}. 
  Analyze the item in this image and match it to the top 4 boxes with % confidence in DESC order. 
  RESPOND ONLY AS VALID JSON "[[ID,CONF],[ID,CONF],[ID,CONF],[ID,CONF]]"
  `;

  const buffer = await file.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");

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
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content || "";
}

function parseOpenAIResponse(content: string): any[] {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : content;
  const json_res = JSON.parse(jsonString);
  return json_res.slice(0, 4).map(([id, confidence]: [string, number]) => ({
    id,
    confidence,
  }));
}

"use server";

import OpenAI from "openai";
import { categoryItems } from "@/data/categoryData";

export async function imageSearch(formData: FormData) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file uploaded" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a base64 representation of the image
  const base64Image = buffer.toString("base64");

  const boxData = categoryItems
    .map((item) => `${item.id}:${item.box_name}`)
    .join(", ");

  const prompt = `
  Boxes: ${boxData}. 
  Analyze the item in this image and match it to the top 3 boxes with % confidence in DESC order. 
  RESPOND ONLY AS VALID JSON "[[ID,CONF],[ID,CONF],[ID,CONF]]"
  `;
  let responseFromAPI;
  try {
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
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    if (response.usage) {
      console.log(`Total tokens used: ${response.usage.total_tokens}`);
    }
    responseFromAPI = response;
  } catch (error: any) {
    console.error("Error in imageSearch:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
  // Check for content
  if (
    responseFromAPI.choices != undefined &&
    responseFromAPI.choices[0] != null
  ) {
    const content = responseFromAPI.choices[0].message.content;
    if (content === null) {
      throw new Error("No content in response");
    }

    // Extract JSON from the content (assuming it's wrapped in backticks)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    if (jsonString == undefined) {
      throw new Error("Unexpected parsing response error");
    }
    const json_res = JSON.parse(jsonString);
    const concatData = json_res
      .map(([id, confidence]: [string, number]) => {
        const item = categoryItems.find((item) => item.id === id);
        return item ? { ...item, confidence } : null;
      })
      .filter(Boolean);

    return { success: true, data: concatData };
  }
  throw new Error("No content provided by OpenAI");
}

"use server";

import OpenAI from "openai";
import { categoryItems } from "@/data/categoryData";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

  // Ensure the uploads directory exists
  const uploadsDir = join(process.cwd(), "public/uploads");
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
    return { success: false, error: "Server error" };
  }

  // Save file to disk
  const filePath = join(uploadsDir, file.name);
  try {
    await writeFile(filePath, buffer);
  } catch (err) {
    console.error("Failed to write file:", err);
    return { success: false, error: "Failed to save file" };
  }

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

    const content = response.choices[0].message.content!.slice(7, -3);
    console.log(content);
    if (!content) {
      throw new Error("No content in response");
    }

    const json_res = JSON.parse(content);
    const concatData = json_res
      .map(([id, confidence]: [string, number]) => {
        const item = categoryItems.find((item) => item.id === id);
        return item ? { ...item, confidence } : null;
      })
      .filter(Boolean);

    return { success: true, data: concatData };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, error: JSON.stringify(error.message) };
  }
}

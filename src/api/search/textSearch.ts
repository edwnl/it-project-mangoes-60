"use server";
import OpenAI from "openai";
import { categoryItems } from "@/data/categoryData";

export async function textSearch(query: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const boxData = categoryItems
    .map((item) => `${item.id}:${item.box_name}`)
    .join(", ");

  const prompt = `
  Boxes: ${boxData}. 
  Match "${query}" to top 3 boxes with % confidence in DESC order. 
  RESPOND ONLY AS VALID JSON "[[ID,CONF],[ID,CONF],[ID,CONF]]"
  `;
  let responseFromAPI;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      model: "gpt-4o-mini",
    });

    if (response.usage) {
      console.log(`Total tokens used: ${response.usage.total_tokens}`);
    }
    responseFromAPI = response;
  } catch (error: any) {
    console.error(error.message);
    return { success: false, error: JSON.stringify(error.message) };
  }
  // Check for content
  if (responseFromAPI.choices !=  undefined && responseFromAPI.choices[0] !=null) {
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
  throw new Error("No content provided by OpenAI")
}

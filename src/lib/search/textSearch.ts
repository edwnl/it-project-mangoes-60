"use server";
import OpenAI from "openai";
import { minimalCategoryItems } from "@/data/demoCategoryData";

export async function textSearch(query: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const boxData = minimalCategoryItems
    .map((item) => `${item.id}:${item.subcategory_name}`)
    .join(", ");

  const prompt = `
  Boxes: ${boxData}. 
  Match "${query}" to top 4 boxes with % confidence in DESC order. 
  RESPOND ONLY AS VALID JSON "[[ID,CONF],[ID,CONF],[ID,CONF], [ID,CONF]]"
  `;

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
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    // Extract JSON from the content (assuming it's wrapped in backticks)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;

    const json_res = JSON.parse(jsonString);
    const concatData = json_res
      .map(([id, confidence]: [string, number]) => {
        const item = minimalCategoryItems.find((item) => item.id === id);
        return item ? { ...item, confidence } : null;
      })
      .filter(Boolean);

    return { success: true, data: concatData };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, error: JSON.stringify(error.message) };
  }
}

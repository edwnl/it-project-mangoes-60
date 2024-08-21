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

  try {
    const completion = await openai.chat.completions.create({
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

    if (completion.usage) {
      console.log(`Total tokens used: ${completion.usage.total_tokens}`);
    }

    const response = completion.choices[0].message.content!.slice(7, -3);

    console.log(response);

    const json_res = JSON.parse(response);
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

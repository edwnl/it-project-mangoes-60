"use server"
import OpenAI from 'openai';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categories = [
  "1ml Luer Slip Syringe", "5ml Luer Lock Syringes",
  "3ml Luer Lock Syringes",
  "10ml Luer Slip Syringes",
  "Thermal Shock Blankets",
  "Cold/Ice Packs",
  "Adhesive Remover Wipe",
  "Eye Patch",
  "Tubular Bandage Roll",
  "Zinc Paste Bandage",
  "Pressure Monitoring",
  "Paediatric Oxygen Mask with 2m Tubing",
  "Silicon Anaesthetic Face Mask",
  "Nasal prongs O2 Cannula with CO2 sample line",
  "Adult Intubating Stylet",
  "Nasopharyngeal Tube"
];

export async function smartSearch(query: string) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `from these categories ${[...categories]}, please find me the top 3 categories that the product name: "${query}" might be. Please only respond in JSON format in the following schema { "top_categories": result}`,
            },
          ],
        },
      ],
      model: "gpt-4o-mini",
    });

    const response = completion.choices[0].message.content!.slice(7,-3);
    return JSON.parse(response);
  } catch (e) {
    console.error(e);
  }
}
import { CategoryItem } from "@/components/CategoryGrid";

export function generateAIPrompt(categoryItems: CategoryItem[]): string {
  const categoryList = categoryItems
    .map((item) => `${item.id} - ${item.subcategory_name}`)
    .join("\n");

  return `
You are an AI trained to categorize medical item images into the top 4 most likely subcategories. 

If the prompt includes a category filter, ONLY respond with items in that category.

Respond ONLY as valid JSON: [[ID,CONFIDENCE],[ID,CONFIDENCE],[ID,CONFIDENCE],[ID,CONFIDENCE]]

The response should be sorted by confidence in descending order.

Data Format: ID - CATEGORY NAME - SUBCATEGORY NAME

${categoryList}
  `.trim();
}

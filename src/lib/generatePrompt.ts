import { CategoryItem } from "@/components/CategoryGrid";

export function generateAIPrompt(
  categoryItems: CategoryItem[],
  selectedCategory: string | null,
): string {
  const categoryList = categoryItems
    .map(
      (item) => `${item.id} - ${item.category_name} - ${item.subcategory_name}`,
    )
    .join("\n");

  let prompt = `
Analyze the item in this image and match it to the top 4 SUBCATEGORY with % confidence in DESC order.

${selectedCategory && `STRICTLY FILTER BY ${selectedCategory} Categories`}

YOU CAN ONLY RESPOND WITH SUBCATEGORIES IN THE LIST BELOW.

RESPOND ONLY AS VALID JSON "[[ID,CONF],[ID,CONF],[ID,CONF],[ID,CONF]]"

Data Format: ID - CATEGORY NAME - SUBCATEGORY NAME

${categoryList}
  `.trim();

  return prompt;
}

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
  ${selectedCategory ? `RETURN STRICTLY ONLY ${selectedCategory}` : ""}
  RETURN STRICTLY WITH ONLY SUBCATEGORIES IN THE LIST BELOW.
  RESPOND ONLY AS VALID JSON [["ID",CONF],["ID",CONF],["ID",CONF],["ID",CONF]]
  Data Format: ID - CATEGORY NAME - SUBCATEGORY NAME`;

  console.log(prompt);

  prompt += categoryList;

  return prompt.trim();
}

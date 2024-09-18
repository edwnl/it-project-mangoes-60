import { CategoryItem } from "@/components/CategoryGrid";

export interface SearchResult extends CategoryItem {
  confidence: number;
}

export interface SearchResultsState {
  results: SearchResult[];
  feedback_status: "NOT_PROVIDED" | "CORRECT" | "INCORRECT";
  correct_subcategory?: string;
}

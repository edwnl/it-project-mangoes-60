import categoriesData from "@/lib/data/reduced_categories.json";

export interface CategoryItem {
  id: string;
  subcategory_name: string;
  category_name: string;
  location: string;
  image_url: string;
  confidence?: number;
}

class CategoryLoader {
  private categories: Map<string, CategoryItem>;
  private cachedAllCategories: CategoryItem[] | null = null;

  constructor() {
    this.categories = new Map<string, CategoryItem>();
    this.loadCategories();
  }

  private loadCategories(): void {
    for (const item of categoriesData) {
      this.categories.set(item.id, item);
    }
    console.log(`Loaded ${this.categories.size} categories`);
  }

  getCategoryById(id: string): CategoryItem | undefined {
    return this.categories.get(id);
  }

  getAllCategories(): CategoryItem[] {
    if (this.cachedAllCategories === null) {
      this.cachedAllCategories = Array.from(this.categories.values());
    }
    return this.cachedAllCategories;
  }
}

export const categoryLoader = new CategoryLoader();
export const categoryItems = categoryLoader.getAllCategories();

import categoriesData from "@/lib/categories.json";

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
    return Array.from(this.categories.values());
  }
}

const categoryLoader = new CategoryLoader();

export default categoryLoader;

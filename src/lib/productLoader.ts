import fs from "fs";
import path from "path";

interface Product {
  id: string;
  subcategory_name: string;
  category_name: string;
  location: string;
  image_url: string;
}

class ProductLoader {
  private products: Map<string, Product>;

  constructor() {
    this.products = new Map();
  }

  loadProducts(): void {
    const filePath = path.join(process.cwd(), "public", "products.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const productArray: Product[] = JSON.parse(jsonData);

    for (const product of productArray) {
      this.products.set(product.id, product);
    }

    console.log(`Loaded ${this.products.size} products`);
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }
}

// Create a singleton instance
const productLoader = new ProductLoader();

export default productLoader;

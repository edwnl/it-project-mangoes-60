"use client";

import React from "react";
import Image from "next/image";
import { Empty, Tag } from "antd";
import syringeImage from "@/assets/syringe.png";

export interface CategoryItem {
  id: string;
  subcategory_name: string;
  category_name: string;
  location: string;
  image_url: string;
  confidence?: number;
}

interface CategoryGridProps {
  categories: CategoryItem[];
  showConfidence: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  showConfidence,
}) => {
  if (!categories || categories.length === 0) {
    return <Empty />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-md overflow-hidden"
          >
            <div className="relative h-40 w-40 mx-auto">
              <Image
                src={category.image_url || syringeImage}
                alt={category.subcategory_name}
                layout="fill"
                objectFit="contain"
                className="rounded-md p-2"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                Located at {category.location}
              </p>
              <h3 className="text-lg font-semibold mb-2">
                {category.subcategory_name}
              </h3>
              <div className="flex justify-between items-center">
                <Tag color={"purple"}>
                  {category.category_name.charAt(0).toUpperCase() +
                    category.category_name.slice(1).toLowerCase()}
                </Tag>
                {showConfidence && category.confidence !== undefined && (
                  <Tag color="blue">Confidence: {category.confidence}%</Tag>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

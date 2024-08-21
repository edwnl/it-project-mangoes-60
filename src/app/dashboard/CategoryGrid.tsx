"use client";

import React from "react";
import Image from "next/image";
import { Tag } from "antd";
import syringeImage from "@/assets/syringe.png";

export interface CategoryItem {
  id: string;
  name: string;
  type: string;
  aisle: number;
  column: number;
  image_url: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
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
                src={syringeImage}
                alt={category.name}
                layout="fill"
                objectFit="contain"
                className="rounded-md p-2"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                Located at Aisle {category.aisle}, Column {category.column}
              </p>
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <Tag color={category.type === "SYRINGE" ? "red" : "purple"}>
                {category.type.charAt(0).toUpperCase() +
                  category.type.slice(1).toLowerCase()}
              </Tag>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

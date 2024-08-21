"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Navbar";
import CategoryGrid, { CategoryItem, searchForCategory } from "@/app/dashboard/CategoryGrid";
import { mockCategories } from "@/app/dashboard/mockCategoryData";
import { smartSearch } from "@/app/api/search/smartSearch";
import { TopCategoryAIResponse } from "@/types";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState(mockCategories);
  const handleSearch = (value: TopCategoryAIResponse) => {
    console.log("Searching for:", value);

    let results: CategoryItem[] = [];
    value["top_categories"].map((category: string) =>{
      results.push(...searchForCategory(category));
    })


    setItems(Array.from(new Set(results)));

  };
  const handleLogout = () => {
    console.log("Logging out");
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <NavBar onSearch={handleSearch} onLogout={handleLogout} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-gray-600 mb-6">
          {items.length} categories in total
        </p>
        <div className="mb-6"></div>
        <CategoryGrid categories={items}/>
      </div>
    </div>
  );
};

export default DashboardPage;

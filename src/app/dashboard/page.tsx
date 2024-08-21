"use client";

import React, { useState, useCallback } from "react";
import { Button, message, notification, Spin } from "antd";
import NavBar from "@/components/Navbar";
import CategoryGrid from "@/components/CategoryGrid";
import { categoryItems } from "@/utils/categoryData";
import { CategoryItem } from "@/components/CategoryGrid";
import { smartSearch } from "@/api/search/smartSearch";

interface SearchResult extends CategoryItem {
  confidence: number;
}

const DashboardPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchResults([]);
    setLastQuery(query);

    const startTime = performance.now();

    const { success, data, error } = await smartSearch(query);
    if (!success) {
      api.error({
        message: "Error",
        description: `Something went wrong while fetching results. ${error}.`,
      });
      resetSearch();
      return;
    }

    api.success({
      message: "Search Completed",
      description: `Found 3 result(s) in ${Math.round(performance.now() - startTime)}ms.`,
    });

    setSearchResults(data);
  }, []);

  const resetSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
    setLastQuery("");
  };

  return (
    <div className="min-h-screen">
      {contextHolder}
      <NavBar onSearch={handleSearch} />

      {isSearching && searchResults.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">
              {isSearching ? "Search Results" : "Categories"}
            </h1>
            {isSearching && (
              <Button
                onClick={resetSearch}
                type="primary"
                className={"custom-button"}
              >
                Reset
              </Button>
            )}
          </div>
          <p className="text-gray-600 mb-6">
            {isSearching
              ? `Top 3 results matching "${lastQuery}`
              : `${categoryItems.length} categories in total`}
          </p>
          <CategoryGrid
            categories={isSearching ? searchResults : categoryItems}
            showConfidence={isSearching}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

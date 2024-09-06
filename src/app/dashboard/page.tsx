"use client";

import React, { useState, useCallback } from "react";
import { Button, message, notification, Spin } from "antd";
import NavBar from "@/components/Navbar";
import CategoryGrid from "@/components/CategoryGrid";
import { CategoryItem } from "@/components/CategoryGrid";
import { textSearch } from "@/lib/search/textSearch";
import { categoryItems } from "@/lib/categoryLoader";

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

    const { success, data, error } = await textSearch(query);
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
      description: `Found ${data.length} result(s) in ${Math.round(performance.now() - startTime)}ms.`,
    });

    setSearchResults(data);
    setIsSearching(false);
  }, []);

  const handleImageSearch = useCallback(async (image: File) => {
    setIsSearching(true);
    setSearchResults([]);
    setLastQuery("Image Search");

    const startTime = performance.now();

    const formData = new FormData();
    formData.append("file", image);

    // const { success, searchId, error } = await imageSearch(formData);
    // if (!success) {
    //   api.error({
    //     message: "Error",
    //     description: `Something went wrong while analyzing the image. ${error}.`,
    //   });
    //   resetSearch();
    //   return;
    // }
    //
    // api.success({
    //   message: "Image Search Completed",
    //   description: `Found ${data.length} result(s) in ${Math.round(performance.now() - startTime)}ms.`,
    // });
    //
    // setSearchResults(data);
    setIsSearching(false);
  }, []);

  const resetSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
    setLastQuery("");
  };

  return (
    <div className="min-h-screen">
      {contextHolder}
      <NavBar onSearch={handleSearch} onImageSearch={handleImageSearch} />

      {isSearching ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">
              {searchResults.length > 0 ? "Search Results" : "Categories"}
            </h1>
            {searchResults.length > 0 && (
              <Button
                onClick={resetSearch}
                type="primary"
                className="custom-button"
              >
                Reset
              </Button>
            )}
          </div>
          <p className="text-gray-600 mb-6">
            {searchResults.length > 0
              ? `Top ${searchResults.length} results matching "${lastQuery}"`
              : `${categoryItems.length} categories in total`}
          </p>
          <CategoryGrid
            categories={
              searchResults.length > 0 ? searchResults : categoryItems
            }
            showConfidence={searchResults.length > 0}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

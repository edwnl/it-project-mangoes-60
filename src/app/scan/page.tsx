"use client";

import React, { useState } from "react";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import { Spin } from "antd";

const CameraPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearchResult = (result: any) => {
    setSearchResults(result);
  };

  const handleSearchStateChange = (searching: boolean) => {
    setIsSearching(searching);
    if (searching) {
      setSearchResults(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="md:hidden">
        <CameraComponent
          onSearchResult={handleSearchResult}
          onSearchStateChange={handleSearchStateChange}
        />
      </div>
      <div className="hidden md:block">
      <DragDropImageUpload
        onSearchResult={handleSearchResult}
        onSearchStateChange={handleSearchStateChange}
      />
      </div>

      {isSearching && (
        <div className="mt-8 text-center">
          <Spin />
        </div>
      )}

      {!isSearching && searchResults && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {searchResults.success ? (
            <ul>
              {searchResults.data.map((item: any, index: number) => (
                <li key={index} className="mb-2">
                  {item.box_name}: {item.confidence}% confidence
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-500">{searchResults.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraPage;
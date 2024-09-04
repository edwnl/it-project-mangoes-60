"use client";

import React, { useState } from "react";
import CameraComponent from "@/components/CameraComponent";
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
      <h1 className="text-3xl font-bold mb-4">Camera Test</h1>

      <CameraComponent
        onSearchResult={handleSearchResult}
        onSearchStateChange={handleSearchStateChange}
      />

      {isSearching && (
        <div className="mt-8">
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
                  {item.box_name}: {item.confidence.toFixed(2)}% confidence
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

"use client";

import React, { useState } from "react";
import CameraComponent from "@/components/CameraComponent";

const CameraPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearchResult = (result: any) => {
    setSearchResults(result);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Camera Capture Page</h1>

      <p className="mb-6">
        Welcome to our camera capture feature. This tool allows you to take a
        photo using your device's camera. Simply click the "Start Camera" button
        to begin, then capture your image. You'll have the option to retake or
        confirm your photo once it's captured.
      </p>

      <CameraComponent onSearchResult={handleSearchResult} />

      {searchResults && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {searchResults.success ? (
            <ul>
              {searchResults.data.map((item: any, index: number) => (
                <li key={index} className="mb-2">
                  {item.box_name}: {(item.confidence * 100).toFixed(2)}%
                  confidence
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

"use client";

import React, { useState, useEffect } from "react";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import { Spin } from "antd";
import CategoryFilterButton from "@/components/CategoryFilterButton";

const CameraPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [username, setUsername] = useState("Volunteer");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the 'md' breakpoint in Tailwind by default
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col justify-center w-max">
        <div className={"flex flex-col align-left mb-2 md:pl-8"}>
          <h1 className={"text-3xl"}>Welcome</h1>
          <h1 className={"font-bold text-3xl"}>{username}</h1>
        </div>
      <CategoryFilterButton name={null}/>
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

      {isMobile && isSearching && (
        <div className="mt-8 text-center">
          <Spin />
        </div>
      )}

      {isMobile && !isSearching && searchResults && (
        <div className="mt-8 text-center">
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
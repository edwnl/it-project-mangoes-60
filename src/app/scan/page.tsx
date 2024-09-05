"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, message } from "antd";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import { Spin } from "antd";
import CategoryFilterButton from "@/components/CategoryFilterButton";

const CameraPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [username, setUsername] = useState("Volunteer");

  const handleSearchResult = async (formData: FormData) => {
    try {
      const result = await imageSearch(formData);
      if (result.success && result.searchId) {
        router.push(`/scan/${result.searchId}`);
      } else {
        throw new Error(result.error || "Failed to process image");
      }
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
    }
  };

  const handleSearchStateChange = (isSearching: boolean) => {
    setIsLoading(isSearching);
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

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

      {isLoading && (
        <div className="mt-8 text-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default CameraPage;

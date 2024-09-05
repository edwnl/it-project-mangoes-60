"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, message } from "antd";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import { imageSearch } from "@/api/search/imageSearch";

const CameraPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchResult = async (formData: FormData) => {
    try {
      const result = await imageSearch(formData);
      if (result.success && result.searchId) {
        router.push(`/search-results?searchId=${result.searchId}`);
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

      {isLoading && (
        <div className="mt-8 text-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default CameraPage;

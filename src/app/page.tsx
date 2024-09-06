"use client";

import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import CategoryFilterButton from "@/components/CategoryFilterButton";
import { imageSearch } from "@/api/search/imageSearch";
import { useRouter } from "next/navigation";
import SimpleNavBar from "@/components/SimpleNavBar";

const CameraPage: React.FC = () => {
  const [username, setUsername] = useState("Volunteer");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSearchResult = async (formData: FormData) => {
    try {
      const result = await imageSearch(formData);
      if (result.success && result.searchId) {
        router.push(`/scan/${result.searchId}`);
      } else {
        throw new Error(result.error || "Failed to process image");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
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
    <>
      <SimpleNavBar />
      <div className="container mx-auto flex flex-col justify-center w-max">
        <div className="my-8">
          <div className="flex flex-col text-3xl mb-2">
            <h1>Welcome,</h1>
            <h1 className="font-bold">{username}!</h1>
          </div>
          <CategoryFilterButton
            onCategoryChange={(category) => console.log(category)}
          />
        </div>

        <div className="relative">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
              <Spin size="large" />
              Searching...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CameraPage;

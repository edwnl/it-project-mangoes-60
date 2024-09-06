"use client";

import React, { useState, useEffect } from "react";
import { Spin, message, Button } from "antd";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import CategoryFilterButton from "@/components/CategoryFilterButton";
import { imageSearch } from "@/lib/search/imageSearch";
import { useRouter } from "next/navigation";
import SimpleNavBar from "@/components/SimpleNavBar";
import { generateAIPrompt } from "@/lib/generatePrompt";
import { categoryItems } from "@/data/demoCategoryData";
import categoryLoader from "@/lib/categoryLoader";

const CameraPage: React.FC = () => {
  const [username, setUsername] = useState("Volunteer");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const router = useRouter();

  const handleSearchResult = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setElapsedTime(0);

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
      setIsLoading(false);
      message.error(errorMessage);
    }
  };

  useEffect(() => {
    console.log(generateAIPrompt(categoryLoader.getAllCategories()));
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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
            <CameraComponent onSearchResult={handleSearchResult} />
          </div>
          <div className="hidden md:block">
            <DragDropImageUpload onSearchResult={handleSearchResult} />
          </div>

          <p
            className={
              "max-w-[300px] md:max-w-[350px] mt-4 text-center text-gray-500"
            }
          >
            Please note all uploads are recorded for feedback purposes.
          </p>

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
              <Spin size="large" />
              <p className="mt-2">Searching... ({elapsedTime.toFixed(1)}s)</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CameraPage;

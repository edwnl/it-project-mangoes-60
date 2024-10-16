"use client";

import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { imageSearch } from "@/lib/imageSearch";
import CategoryFilterButton from "@/app/scan/components/CategoryFilterButton";
import DragDropImageUpload from "@/app/scan/components/DragDropImageUpload";
import CameraComponent from "@/app/scan/components/CameraComponent";
import { withGuard } from "@/components/GuardRoute";

const CameraPage: React.FC = () => {
  // state setup
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [categoryFilterID, setCategoryFilter] = useState<string | null>(null);
  const { user } = useAuth();

  const router = useRouter();

  // handle image search and result
  const handleSearchResult = async (formData: FormData) => {
    if (!user || !user.uid) {
      message.error("You must be logged in to do this.");
      throw new Error("Not logged in!");
    }

    try {
      setIsLoading(true);
      setElapsedTime(0);

      // add category filter if selected
      if (categoryFilterID) {
        formData.append("category", categoryFilterID);
      }

      formData.append("userID", user.uid);

      const result = await imageSearch(formData);

      console.log(result);

      if (result.searchId) {
        router.push(`/scan/${result.searchId}`);
      } else {
        throw new Error(result.error || "Failed to process image");
      }
    } catch (err: any) {
      message.error(err);
      setIsLoading(false);
    }
  };

  // update category filter
  const handleCategoryChange = (categoryName: string | null) => {
    setCategoryFilter(categoryName);
    console.log("Selected category:", categoryName);
  };

  // timer for search duration
  useEffect(() => {
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
      <NavBar />
      <div className="container mx-auto flex flex-col justify-center w-max">
        {/* welcome message and category filter */}
        <div className="mb-10">
          <div className="flex flex-col text-3xl mb-2">
            <h1>Welcome,</h1>
            <h1 className="font-bold">Username!</h1>
          </div>
          <CategoryFilterButton
            onCategoryChange={handleCategoryChange}
            isDisabled={isLoading}
          />
        </div>

        {/* image upload components */}
        <div className="relative">
          <div className="block md:hidden">
            <CameraComponent onSearchResult={handleSearchResult} />
          </div>
          <div className="hidden md:block">
            <DragDropImageUpload onSearchResult={handleSearchResult} />
          </div>

          {/* loading overlay */}
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

export default withGuard(CameraPage, { requireAuth: true });

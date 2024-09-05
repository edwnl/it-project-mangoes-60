"use client";

import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import CameraComponent from "@/components/CameraComponent";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import CategoryFilterButton from "@/components/CategoryFilterButton";
import { imageSearch } from "@/api/search/imageSearch";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
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
    <>
      <SimpleNavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col justify-center w-max">
        <div className={"flex flex-col align-left mb-2 md:pl-8"}>
          <h1 className={"text-3xl"}>Welcome</h1>
          <h1 className={"font-bold text-3xl"}>{username}!</h1>
        </div>
        <div className={"mb-8"}>
          <CategoryFilterButton name={null} />
        </div>
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
    </>
  );
};

export default CameraPage;

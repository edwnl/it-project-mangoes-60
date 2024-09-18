// File: src/pages/SearchResultsPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Spin, message, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { doc, getDoc, updateDoc, DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { categoryLoader } from "@/lib/categoryLoader";
import { SearchResult, SearchResultsState } from "@/types/SearchTypes";
import ResultCard from "@/components/ResultCard";
import ImageModal from "@/components/modals/ImageModal";
import ConfirmModal from "@/components/modals/ConfirmModal";

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [searchResultsState, setSearchResultsState] =
    useState<SearchResultsState>({
      results: [],
      feedback_status: "NOT_PROVIDED",
    });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] =
    useState<boolean>(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false);
  const [isImageModalVisible, setIsImageModalVisible] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  useEffect(() => {
    const fetchSearchResults = async (resultId: string) => {
      try {
        const searchDocRef = doc(db, "searchResults", resultId);
        const searchDocSnap = await getDoc(searchDocRef);

        if (searchDocSnap.exists()) {
          const data = searchDocSnap.data();
          setUploadedImageUrl(data.imageUrl);

          const fullResults = data.results
            .map((result: SearchResult) => {
              const categoryItem = categoryLoader.getCategoryById(
                result.id.toString(),
              );
              return categoryItem
                ? { ...categoryItem, confidence: result.confidence }
                : null;
            })
            .filter((item: SearchResult | null) => item !== null);

          setSearchResultsState({
            results: fullResults.slice(0, 4),
            feedback_status: data.feedback_status || "NOT_PROVIDED",
            correct_subcategory: data.correct_subcategory,
          });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.result_id) {
      fetchSearchResults(params.result_id as string);
    }
  }, [params.result_id]);

  const handleBack = () => {
    router.push("/");
  };

  const handleCardClick = (item: SearchResult) => {
    setSelectedItem(item);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmCategorySelection = async () => {
    if (selectedItem) {
      setIsSubmittingFeedback(true);
      const updatedState: SearchResultsState = {
        ...searchResultsState,
        feedback_status: "CORRECT",
        correct_subcategory: selectedItem.id,
      };
      setSearchResultsState(updatedState);
      await updateFeedbackInFirestore(updatedState);
      setIsSubmittingFeedback(false);
      setIsConfirmModalVisible(false);
      message.success("Feedback submitted successfully");
    }
  };

  const handleCantFindCategory = () => {
    setIsConfirmModalVisible(true);
    setSelectedItem(null);
  };

  const handleConfirmIncorrectResults = async () => {
    setIsSubmittingFeedback(true);
    const updatedState: SearchResultsState = {
      ...searchResultsState,
      feedback_status: "INCORRECT",
      correct_subcategory: undefined,
    };
    setSearchResultsState(updatedState);
    await updateFeedbackInFirestore(updatedState);
    setIsSubmittingFeedback(false);
    setIsConfirmModalVisible(false);
    message.success("All results marked as incorrect");
  };

  const updateFeedbackInFirestore = async (
    updatedState: SearchResultsState,
  ) => {
    if (params.result_id) {
      try {
        const searchDocRef: DocumentReference = doc(
          db,
          "searchResults",
          params.result_id as string,
        );
        await updateDoc(searchDocRef, {
          feedback_status: updatedState.feedback_status,
          correct_subcategory: updatedState.correct_subcategory || null,
        });
      } catch (error) {
        console.error("Error updating feedback:", error);
        message.error("Failed to submit feedback");
      }
    }
  };

  const handleImageClick = () => {
    setIsImageModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto bg-white p-4">
      <header className="flex justify-between items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="custom-button"
        >
          Back
        </Button>
      </header>

      <main className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Search Results</h1>
        <p className="mb-4">
          Showing results for{" "}
          <span className="cursor-pointer underline" onClick={handleImageClick}>
            image.
          </span>{" "}
        </p>

        <div className="relative mb-6">
          {isSubmittingFeedback && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <Spin size="large" />
            </div>
          )}

          {searchResultsState.results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              {searchResultsState.results.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  isCorrect={
                    searchResultsState.correct_subcategory === result.id
                  }
                  isIncorrect={
                    searchResultsState.feedback_status === "INCORRECT"
                  }
                  onClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No search results found"
            />
          )}
        </div>

        {searchResultsState.results.length > 0 && (
          <div className="flex justify-center relative">
            {isSubmittingFeedback && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <Spin size="small" />
              </div>
            )}
            <Button
              onClick={handleCantFindCategory}
              className="custom-button bg-[#BF0018] text-white hover:bg-[#8B0012] border-none"
              disabled={isSubmittingFeedback}
            >
              Mark all as Incorrect
            </Button>
          </div>
        )}
      </main>

      <ConfirmModal
        isVisible={isConfirmModalVisible}
        selectedItem={selectedItem}
        onConfirm={
          selectedItem
            ? handleConfirmCategorySelection
            : handleConfirmIncorrectResults
        }
        onCancel={() => setIsConfirmModalVisible(false)}
      />

      <ImageModal
        isVisible={isImageModalVisible}
        imageUrl={uploadedImageUrl}
        onClose={() => setIsImageModalVisible(false)}
      />
    </div>
  );
};

export default SearchResultsPage;

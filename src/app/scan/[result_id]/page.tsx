"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Tag, Spin, Modal, message, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import { doc, getDoc, updateDoc, DocumentReference } from "firebase/firestore";
import { categoryItems } from "@/data/categoryData";
import { db } from "@/api/firebaseClient";
import { CategoryItem } from "@/components/CategoryGrid";

interface SearchResult extends CategoryItem {
  confidence: number;
}

interface SearchResultsState {
  results: SearchResult[];
  feedback_status: "NOT_PROVIDED" | "CORRECT" | "INCORRECT";
  correct_subcategory?: string;
}

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

          const fullResults: SearchResult[] = data.results
            .map((result: any) => {
              const categoryItem = categoryItems.find(
                (item) => item.id === result.id,
              );
              return categoryItem
                ? {
                    ...categoryItem,
                    confidence: result.confidence,
                  }
                : null;
            })
            .filter(Boolean);

          setSearchResultsState({
            results: fullResults.slice(0, 4), // Limit to 4 results
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

      <main className={"max-w-xl mx-auto"}>
        <h1 className="text-2xl font-bold mb-1">Search Results</h1>
        <p className={"mb-4"}>
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
                <div
                  key={result.id}
                  className="border rounded-lg p-4 cursor-pointer w-full max-w-[300px]"
                  onClick={() => handleCardClick(result)}
                >
                  <Image
                    src={result.image_url}
                    alt={result.subcategory_name}
                    width={150}
                    height={150}
                    className="mb-2 object-contain"
                  />
                  <p className="text-sm text-gray-500">{result.id}</p>
                  <p className="font-semibold">{result.subcategory_name}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Tag
                      color={
                        result.category_name === "Medical Supplies"
                          ? "#FFCCCB"
                          : result.category_name === "Airway Supplies"
                            ? "#FFE5B4"
                            : result.category_name === "First-Aid Supplies"
                              ? "#E5FFE5"
                              : "#CCE5FF"
                      }
                    >
                      {result.category_name}
                    </Tag>
                    {searchResultsState.correct_subcategory === result.id && (
                      <Tag color="green">Correct</Tag>
                    )}
                    {searchResultsState.feedback_status === "INCORRECT" && (
                      <Tag color="red">Incorrect</Tag>
                    )}
                  </div>
                </div>
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

      <Modal
        title="Confirm Category Selection"
        open={isConfirmModalVisible}
        onOk={
          selectedItem
            ? handleConfirmCategorySelection
            : handleConfirmIncorrectResults
        }
        onCancel={() => setIsConfirmModalVisible(false)}
        okText={
          selectedItem ? "Confirm Selection" : "Yes, mark all as incorrect"
        }
        cancelText="Cancel"
      >
        {selectedItem ? (
          <p>
            Are you sure you want to select "{selectedItem.subcategory_name}" as
            the correct category?
          </p>
        ) : (
          <p>Are you sure you want to mark all results as incorrect?</p>
        )}
      </Modal>

      <Modal
        title="Searched Image"
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
      >
        {uploadedImageUrl && (
          <Image
            src={uploadedImageUrl}
            alt="Searched Image"
            width={400}
            height={400}
            className="object-contain"
          />
        )}
      </Modal>
    </div>
  );
};

export default SearchResultsPage;

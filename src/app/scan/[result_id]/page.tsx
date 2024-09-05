"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card, Tag, Spin, Empty, Modal, message } from "antd";
import {
  ArrowLeftOutlined,
  MenuOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
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
            results: fullResults,
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
    router.push("/scan");
  };

  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };

  const handleReportIncorrectResults = async () => {
    const updatedState: SearchResultsState = {
      ...searchResultsState,
      feedback_status: "INCORRECT",
      correct_subcategory: undefined,
    };
    setSearchResultsState(updatedState);
    await updateFeedbackInFirestore(updatedState);
    message.success("All results marked as incorrect");
    setIsConfirmModalVisible(false);
  };

  const handleCardClick = (item: SearchResult) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (selectedItem) {
      const updatedState: SearchResultsState = {
        ...searchResultsState,
        feedback_status: "CORRECT",
        correct_subcategory: selectedItem.id,
      };
      setSearchResultsState(updatedState);
      await updateFeedbackInFirestore(updatedState);
      setIsModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirmModalCancel = () => {
    setIsConfirmModalVisible(false);
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
        message.success("Feedback submitted successfully");
      } catch (error) {
        console.error("Error updating feedback:", error);
        message.error("Failed to submit feedback");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <header className="flex justify-between items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="custom-button"
        >
          Back
        </Button>
        <Button icon={<MenuOutlined />} />
      </header>

      <main>
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={showConfirmModal}
            className="custom-button"
            disabled={searchResultsState.feedback_status === "INCORRECT"}
          >
            Report All Results as Incorrect
          </Button>
        </div>

        <div className="mt-4 flex justify-center mb-4">
          <Tag
            color={
              searchResultsState.feedback_status === "CORRECT"
                ? "green"
                : searchResultsState.feedback_status === "INCORRECT"
                  ? "red"
                  : "gray"
            }
            className="text-lg"
          >
            Overall Feedback: {searchResultsState.feedback_status}
          </Tag>
        </div>

        {uploadedImageUrl && (
          <div className="mb-4 flex justify-center">
            <Image
              src={uploadedImageUrl}
              alt="Uploaded Image"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {searchResultsState.results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {searchResultsState.results.map((result) => (
              <Card
                key={result.id}
                className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCardClick(result)}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={result.image_url}
                    alt={result.subcategory_name}
                    width={150}
                    height={150}
                    className="mb-2 object-contain"
                  />
                  <p className="text-lg font-semibold">
                    {result.subcategory_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {result.confidence.toFixed(2)}%
                  </p>
                  <Tag color="#BF0018" className="mt-2">
                    {result.category_name}
                  </Tag>
                  <p className="text-xs text-gray-500 mt-1">
                    Location: {result.location}
                  </p>
                  {searchResultsState.correct_subcategory === result.id && (
                    <Tag color="green" className="mt-2">
                      Marked as Correct
                    </Tag>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="No results found" className="mt-8" />
        )}
      </main>

      <Modal
        title="Confirm Subcategory"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Mark as Correct"
        cancelText="Cancel"
      >
        <p>Is this the correct subcategory for the image?</p>
        {selectedItem && (
          <div className="flex flex-col items-center mt-4">
            <Image
              src={selectedItem.image_url}
              alt={selectedItem.subcategory_name}
              width={100}
              height={100}
              className="mb-2 object-contain"
            />
            <p className="font-semibold">{selectedItem.subcategory_name}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Confirm Action"
        open={isConfirmModalVisible}
        onOk={handleReportIncorrectResults}
        onCancel={handleConfirmModalCancel}
        okText="Yes, mark all as incorrect"
        cancelText="Cancel"
      >
        <p>Are you sure you want to mark all results as incorrect?</p>
      </Modal>
    </div>
  );
};

export default SearchResultsPage;

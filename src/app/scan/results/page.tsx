"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, Tag, Spin, Empty, Modal, message } from "antd";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import Image from "next/image";
import { doc, getDoc, updateDoc, DocumentReference } from "firebase/firestore";
import { categoryItems } from "@/data/categoryData";
import { db } from "@/api/firebaseClient";
import { CategoryItem } from "@/components/CategoryGrid";

interface SearchResult extends CategoryItem {
  confidence: number;
  feedback_status: "NOT_PROVIDED" | "CORRECT" | "INCORRECT";
  correct_subcategory?: string;
}

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  useEffect(() => {
    const fetchSearchResults = async (searchId: string) => {
      try {
        const searchDocRef = doc(db, "searchResults", searchId);
        const searchDocSnap = await getDoc(searchDocRef);

        if (searchDocSnap.exists()) {
          const data = searchDocSnap.data();
          setUploadedImageUrl(data.imageUrl);

          const fullResults: SearchResult[] = data.results.map(
            (result: any) => {
              const categoryItem = categoryItems.find(
                (item) => item.id === result.id,
              );
              return categoryItem
                ? {
                    ...categoryItem,
                    confidence: result.confidence,
                    feedback_status: result.feedback_status || "NOT_PROVIDED",
                    correct_subcategory: result.correct_subcategory,
                  }
                : null;
            },
          );

          setSearchResults(fullResults);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady && typeof router.query.searchId === "string") {
      fetchSearchResults(router.query.searchId);
    }
  }, [router.isReady, router.query]);

  const handleBack = () => {
    router.push("/scan");
  };

  const handleReportIncorrectResults = async () => {
    const updatedResults: SearchResult[] = searchResults.map((result) => ({
      ...result,
      feedback_status: "INCORRECT",
      correct_subcategory: undefined,
    }));
    setSearchResults(updatedResults);
    await updateFeedbackInFirestore(updatedResults);
    message.success("All results marked as incorrect");
  };

  const handleCardClick = (item: SearchResult) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (selectedItem) {
      const updatedResults: SearchResult[] = searchResults.map((result) =>
        result.id === selectedItem.id
          ? {
              ...result,
              feedback_status: "CORRECT",
              correct_subcategory: selectedItem.id,
            }
          : result,
      );
      setSearchResults(updatedResults);
      await updateFeedbackInFirestore(updatedResults);
      setIsModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const updateFeedbackInFirestore = async (updatedResults: SearchResult[]) => {
    if (typeof router.query.searchId === "string") {
      try {
        const searchDocRef: DocumentReference = doc(
          db,
          "searchResults",
          router.query.searchId,
        );
        await updateDoc(searchDocRef, {
          results: updatedResults.map(
            ({ id, confidence, feedback_status, correct_subcategory }) => ({
              id,
              confidence,
              feedback_status,
              correct_subcategory,
            }),
          ),
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

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {searchResults.map((result) => (
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
                  <Tag
                    color={
                      result.feedback_status === "CORRECT"
                        ? "green"
                        : result.feedback_status === "INCORRECT"
                          ? "red"
                          : "gray"
                    }
                    className="mt-2"
                  >
                    Feedback: {result.feedback_status}
                  </Tag>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="No results found" className="mt-8" />
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleReportIncorrectResults}
            className="custom-button"
          >
            Report All Results as Incorrect
          </Button>
        </div>
      </main>

      <Modal
        title="Confirm Subcategory"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Correct"
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
    </div>
  );
};

export default SearchResultsPage;

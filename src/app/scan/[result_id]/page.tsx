"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Empty, message, Modal, Spin, Tag } from "antd";
import Image from "next/image";
import NavBar from "@/components/Navbar";
import {
  fetchSearchResults,
  updateCorrectSubCategory,
} from "@/app/scan/[result_id]/actions";
import { SearchHistory, Subcategory } from "@/types/types";
import { uppercaseToReadable } from "@/lib/utils";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import EditSubcategoryModal from "@/app/scan/[result_id]/components/EditSubcategoryModal";
import { withGuard } from "@/components/GuardRoute";

interface SearchResult extends Subcategory {
  confidence: number;
}

// main page displaying the results of a scan
const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [results, setResults] = useState<SearchHistory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const { getSubcategoryById } = useSubcategories();

  // fetch search results on component mount
  useEffect(() => {
    const loadSearchResults = async () => {
      const result = await fetchSearchResults(params.result_id as string);
      if (result) {
        // complete results with subcategory details from context
        const completedResult = {
          ...result,
          results: result.results.map((result) =>
            getSubcategoryById(result.id),
          ),
        } as SearchHistory;
        console.log(completedResult);
        setResults(completedResult);
      }
      setIsLoading(false);
    };

    if (params.result_id) {
      loadSearchResults();
    }
  }, [params.result_id]);

  // open edit modal when a result card is clicked
  const handleCardClick = (item: SearchResult) => {
    setSelectedSubcategory(item);
    setEditModalOpen(true);
  };

  // handle subcategory update
  const handleConfirmCategorySelection = async (
    subcategoryId: string,
    subcategoryName: string,
    subcategoryLocation: string,
    quantity: number,
    isBoxFull: boolean,
  ) => {
    setEditModalOpen(false);
    setIsLoading(true);
    try {
      await updateCorrectSubCategory(
        params.result_id as string,
        subcategoryId,
        subcategoryName,
        subcategoryLocation,
        quantity,
        isBoxFull,
      );
      // update the state with the new correct subcategory and quantity
      setResults((prevResults) => {
        if (!prevResults) return null;
        return {
          ...prevResults,
          correct_subcategory_id: subcategoryId,
          scanned_quantity: quantity,
        };
      });
    } catch (error) {
      message.error("Failed to update subcategory.");
    } finally {
      setIsLoading(false);
    }
  };

  // open image modal
  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  return (
    <>
      <NavBar />
      <div className="max-w-xl mx-auto px-8">
        {/* renders the page header */}
        <h1 className="text-3xl font-bold mb-1">Scan Results</h1>
        <p className="mb-1">
          Showing results for{" "}
          <span className="cursor-pointer underline" onClick={handleImageClick}>
            image.
          </span>{" "}
        </p>

        {/* renders any applied category filter */}
        {results && results.category_filter_name && (
          <Tag className={"mb-4"} color={"red"}>
            Filter Applied: {uppercaseToReadable(results.category_filter_name)}
          </Tag>
        )}

        {/* renders user who scanned the items */}
        {results && results.user_data && (
          <Tag className={"mb-4"}>Scanned By: {results.user_data.name}</Tag>
        )}

        {/* renders the search results or empty state */}
        <div className="relative mb-6">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <Spin size="large" />
            </div>
          )}

          {results && results.results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              {results.results.map((result) => (
                // renders individual result cards
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
                    className="mb-2 object-contain mx-auto"
                  />
                  <p className="text-sm text-gray-500">{result.location}</p>
                  <p className="font-semibold">{result.subcategory_name}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Tag>{uppercaseToReadable(result.category_name)}</Tag>
                    {results.correct_subcategory_id === result.id && (
                      <Tag color="green">Correct</Tag>
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

        {/* renders the search again button */}
        {results && results.results.length > 0 && (
          <div className="flex justify-center relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <Spin size="small" />
              </div>
            )}
            <Button
              onClick={() => router.push("/")}
              className="custom-button bg-[#BF0018] text-white hover:bg-[#8B0012] border-none"
            >
              Can't find the category?
            </Button>
          </div>
        )}

        {/* renders the edit subcategory modal */}
        <EditSubcategoryModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          selectedSubcategory={selectedSubcategory}
          correctSubcategoryId={results?.correct_subcategory_id || ""}
          currentQuantity={results?.scanned_quantity || 1}
          boxFull={results?.isCorrectCategoryFull || false}
          onConfirm={handleConfirmCategorySelection}
        />

        {/* renders the modal to show the searched image */}
        <Modal
          title="Searched Image"
          open={imageModalOpen}
          onCancel={() => setImageModalOpen(false)}
          footer={null}
          width={350}
        >
          {results && results.image_url && (
            <Image
              src={results.image_url}
              alt="Searched Image"
              width={300}
              height={300}
              className="rounded-md"
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default withGuard(SearchResultsPage, { requireAuth: true });

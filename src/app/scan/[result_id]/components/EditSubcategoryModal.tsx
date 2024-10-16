"use client";

import React, { useEffect, useState } from "react";
import { Button, Descriptions, message, Modal, Tag } from "antd";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Subcategory } from "@/types/types";
import ReportFullButton from "@/components/ReportFullButton";

interface EditSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubcategory: Subcategory | null;
  correctSubcategoryId: string;
  currentQuantity: number;
  onConfirm: (subcategoryId: string, quantity: number) => Promise<void>;
}

// modal that allows users to edit the details of a selected sub-category
const EditSubcategoryModal: React.FC<EditSubcategoryModalProps> = ({
  isOpen,
  onClose,
  selectedSubcategory,
  correctSubcategoryId,
  currentQuantity,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState<number>(currentQuantity);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // reset quantity and box status when modal opens
  useEffect(() => {
    if (isOpen) setQuantity(currentQuantity);
  }, [isOpen, currentQuantity]);

  // handle quantity input change
  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 150) {
      setQuantity(numValue);
    }
  };

  // handle confirm button click
  const handleConfirm = async () => {
    if (!selectedSubcategory) return;
    setIsLoading(true);
    try {
      await onConfirm(selectedSubcategory.id, quantity);
      message.success("Item updated successfully.");
      onClose();
    } catch (error) {
      message.error("Failed to update item.");
    } finally {
      setIsLoading(false);
    }
  };

  // check if the selected subcategory is correct and if the quantity has changed
  const isCorrectSubcategory = selectedSubcategory?.id === correctSubcategoryId;
  const isQuantityChanged = quantity !== currentQuantity;
  const buttonText = isCorrectSubcategory ? "Update" : "Change Item";
  const isButtonDisabled = isCorrectSubcategory && !isQuantityChanged;

  // renders the modal content for editing the sub-category details
  return (
    <Modal
      title="Edit Item"
      className="top-14"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={350}
    >
      {selectedSubcategory && (
        <>
          {/* renders the sub-category image */}
          <Image
            src={selectedSubcategory.image_url}
            alt="Subcategory Image"
            width={250}
            height={250}
            className="rounded-md mx-auto"
          />

          {/* renders the sub-category name and category tag */}
          <p className="text-base font-bold">
            {selectedSubcategory.subcategory_name}
          </p>
          <Tag className="mt-0.5">{selectedSubcategory.category_name}</Tag>

          {/* renders sub-category details including location and quantity input */}
          <Descriptions className="my-4 text-base" bordered>
            <Descriptions.Item label="Location" span={3}>
              <p>{selectedSubcategory.location}</p>
            </Descriptions.Item>
            <Descriptions.Item label="Count" span={3}>
              <Input
                inputMode="numeric"
                className="text-base h-8"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min={1}
                max={150}
              />
            </Descriptions.Item>
          </Descriptions>

          {/* renders the confirmation button */}
          <Button
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isButtonDisabled}
            className={`w-full mb-2 ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-600"
                : "custom-button bg-[#BF0018] text-white hover:bg-[#8B0012]"
            } border-none`}
          >
            {buttonText}
          </Button>

          <ReportFullButton subcategory={selectedSubcategory} />
        </>
      )}
    </Modal>
  );
};

export default EditSubcategoryModal;

"use client";

import React, { useEffect, useState } from "react";
import { Button, Descriptions, message, Modal, Switch, Tag } from "antd";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Subcategory } from "@/types/types";

interface EditSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubcategory: Subcategory | null;
  correctSubcategoryId: string;
  currentQuantity: number;
  boxFull: boolean;
  onConfirm: (
    subcategoryId: string,
    subcategoryName: string,
    subcategoryLocation: string,
    quantity: number,
    boxFull: boolean,
  ) => Promise<void>;
}

// modal that allows users to edit the details of a selected sub-category
const EditSubcategoryModal: React.FC<EditSubcategoryModalProps> = ({
  isOpen,
  onClose,
  selectedSubcategory,
  correctSubcategoryId,
  currentQuantity,
  boxFull,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState<number>(currentQuantity);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBoxFull, setIsBoxFull] = useState<boolean>(boxFull);
  // reset quantity and box status when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(currentQuantity);
      setIsBoxFull(boxFull);
    }
  }, [isOpen, currentQuantity, boxFull]);

  // handle quantity input change
  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 150) {
      setQuantity(numValue);
    }
  };

  // handle box is full change
  const handleBoxFullChange = (checked: boolean) => {
    setIsBoxFull(checked);
    if (checked) console.log("The box has been set to full");
  };

  // handle confirm button click
  const handleConfirm = async () => {
    if (!selectedSubcategory) return;
    setIsLoading(true);
    try {
      await onConfirm(
        selectedSubcategory.id,
        selectedSubcategory.subcategory_name,
        selectedSubcategory.location,
        quantity,
        isBoxFull,
      );
      message.success("Subcategory updated successfully.");
      onClose();
    } catch (error) {
      message.error("Failed to update subcategory.");
    } finally {
      setIsLoading(false);
    }
  };

  // check if the selected subcategory is correct and if the quantity has changed
  const isCorrectSubcategory = selectedSubcategory?.id === correctSubcategoryId;
  const isBoxStatusChanged = boxFull != isBoxFull;
  const isQuantityChanged = quantity !== currentQuantity;
  const buttonText = isCorrectSubcategory ? "Update" : "Change Item";
  const isButtonDisabled =
    isCorrectSubcategory && !isQuantityChanged && !isBoxStatusChanged;
  console.log(isBoxStatusChanged);

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
            <Descriptions.Item label="Box is full" span={3}>
              <Switch
                defaultChecked={isBoxFull}
                onChange={handleBoxFullChange}
              />
            </Descriptions.Item>
          </Descriptions>

          {/* renders the confirmation button */}
          <Button
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isButtonDisabled}
            className={`w-full ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-600"
                : "custom-button bg-[#BF0018] text-white hover:bg-[#8B0012]"
            } border-none`}
          >
            {buttonText}
          </Button>
        </>
      )}
    </Modal>
  );
};

export default EditSubcategoryModal;

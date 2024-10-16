"use client";

import React, { useState } from "react";
import { Button, Image, InputNumber, Modal, Select } from "antd";
import { SearchHistory } from "@/types/types";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import { useRouter } from "next/navigation";

interface EditHistoryProps {
  record: SearchHistory;
  isModalOpen: boolean;
  handleOk: (updatedRecord: SearchHistory) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleCancel: () => void;
}

const { Option } = Select;

// allows editing of a specific history record
export const EditHistory: React.FC<EditHistoryProps> = ({
  record,
  isModalOpen,
  handleOk,
  handleDelete,
  handleCancel,
}) => {
  const [updatedRecord, setUpdatedRecord] = useState<SearchHistory>(record);
  const { subcategories } = useSubcategories();
  const router = useRouter();
  if (!subcategories) throw new Error("Item list not found!");

  // handles changes in the selected subcategory
  const handleSubcategoryChange = (value: string) => {
    setUpdatedRecord((prev) => ({ ...prev, correct_subcategory_id: value }));
  };

  // handles changes in the scanned quantity input
  const handleQuantityChange = (value: number | null) => {
    setUpdatedRecord((prev) => ({ ...prev, scanned_quantity: value || 0 }));
  };

  // finalizes the edit when clicking 'OK'
  const onOk = () => {
    handleOk(updatedRecord);
  };

  // renders the modal UI for editing a history record
  return (
    <Modal
      title="Edit History"
      open={isModalOpen}
      width={350}
      onOk={onOk}
      onCancel={handleCancel}
      footer={[
        <Button key="delete" onClick={handleDelete} danger>
          Delete
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          Update
        </Button>,
      ]}
    >
      {/* renders history image */}
      <div className="flex justify-center mb-4">
        <Image
          width={200}
          preview={false}
          src={updatedRecord.image_url}
          alt="history record image"
        />
      </div>

      {/* renders subcategory selection dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subcategory
        </label>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select an item"
          optionFilterProp="children"
          value={updatedRecord.correct_subcategory_id}
          onChange={handleSubcategoryChange}
          filterOption={(input, option) =>
            (option?.children as unknown as string)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {subcategories.map((subcat) => (
            <Option key={subcat.id} value={subcat.id}>
              {subcat.subcategory_name}
            </Option>
          ))}
        </Select>
      </div>

      {/* renders scanned quantity input field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700  mb-2">
          Total Scanned
        </label>
        <InputNumber
          min={1}
          max={1000}
          value={updatedRecord.scanned_quantity}
          onChange={handleQuantityChange}
          style={{ width: "100%" }}
        />
      </div>

      {/* renders information about who scanned the item */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scanned by
        </label>
        <p>
          {record.user_data?.name || "Unknown"} (
          {record.user_data?.email || "No email"})
        </p>
      </div>

      {/* renders link that can take the users back to the scan results */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID
        </label>
        <p
          className={"underline cursor-pointer"}
          onClick={() => router.push(`/scan/${record.history_id}`)}
        >
          {record.history_id}
        </p>
      </div>
    </Modal>
  );
};

"use client";

import React from "react";
import { Modal, Select } from "antd";
import { useSubcategories } from "@/contexts/SubcategoriesContext";

const { Option } = Select;

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onFilter: (category: string) => void;
}

// modal that allows users to filter sub-categories by category
const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onFilter,
}) => {
  const { subcategories } = useSubcategories();

  const categories = Array.from(
    new Set(subcategories.map((item) => item.category_name)),
  );

  const handleSelect = (value: string) => {
    onFilter(value);
    onClose();
  };

  // renders modal with a select dropdown for filtering by category
  return (
    <Modal
      title="Filter by Category"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {/* renders select dropdown for choosing a category */}
      <Select
        style={{ width: "100%" }}
        placeholder="Select a category"
        onChange={handleSelect}
      >
        {categories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default FilterModal;

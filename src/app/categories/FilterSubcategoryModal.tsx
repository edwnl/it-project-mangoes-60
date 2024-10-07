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

  return (
    <Modal
      title="Filter by Category"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
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

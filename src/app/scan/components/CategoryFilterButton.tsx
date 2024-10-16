import React, { useState } from "react";
import { Button, Modal, Select } from "antd";
import { uppercaseToReadable } from "@/lib/utils";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import { FilterOutlined } from "@ant-design/icons";

interface CategoryFilterButtonProps {
  onCategoryChange: (category: string | null) => void;
  isDisabled?: boolean;
}

// component for selecting and displaying category filters
const CategoryFilterButton: React.FC<CategoryFilterButtonProps> = ({
  onCategoryChange,
  isDisabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const { subcategories } = useSubcategories();

  // get unique categories from subcategories
  const uniqueCategories = Array.from(
    new Set(subcategories.map((item) => item.category_name)),
  );

  // handle category selection
  const handleCategoryChange = (value: string | null) => {
    setCategoryName(value);
    onCategoryChange(value);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* category filter button */}
      <Button
        className="w-fit border-dashed text-[#72000B] border-[#72000B] border-2"
        onClick={() => setIsModalVisible(true)}
        disabled={isDisabled}
      >
        <FilterOutlined />
        Category Filter:
        <div className="font-bold">
          {categoryName ? uppercaseToReadable(categoryName) : "None"}
        </div>
      </Button>
      {/* category selection modal */}
      <Modal
        title="Select Category"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className={"max-w-[400px] px-8"}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select a category"
          onChange={handleCategoryChange}
          value={categoryName}
        >
          <Select.Option value={null}>None</Select.Option>
          {uniqueCategories.map((category) => (
            <Select.Option key={category} value={category}>
              {uppercaseToReadable(category)}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default CategoryFilterButton;

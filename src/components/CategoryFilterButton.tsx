import React, { useState } from "react";
import { Button, Modal, Select } from "antd";
import { FilterIcon } from "lucide-react";
import { categoryItems } from "@/data/categoryData";

interface CategoryFilterButtonProps {
  onCategoryChange: (category: string | null) => void;
}

const formatCategoryName = (name: string): string => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CategoryFilterButton: React.FC<CategoryFilterButtonProps> = ({
  onCategoryChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const uniqueCategories = Array.from(
    new Set(categoryItems.map((item) => item.category_name)),
  );

  const handleOk = () => {
    setIsModalVisible(false);
    onCategoryChange(categoryName);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCategoryChange = (value: string | null) => {
    setCategoryName(value);
  };

  return (
    <>
      <Button
        className="w-fit border-dashed text-[#72000B] border-[#72000B] border-2"
        onClick={() => setIsModalVisible(true)}
      >
        <FilterIcon />
        Category Filter:
        <div className="font-bold">
          {categoryName ? formatCategoryName(categoryName) : "None"}
        </div>
      </Button>
      <Modal
        title="Select Category"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"max-w-[300px]"}
        okButtonProps={{ className: "custom-button" }}
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
              {formatCategoryName(category)}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default CategoryFilterButton;

"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Popconfirm } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteCategory, renameCategory } from "@/app/categories/actions";

interface CategoryManageModalProps {
  isVisible: boolean;
  onClose: () => void;
  categoryName: string;
}

// modal that allows users to manage categories, including renaming or deleting
const CategoryManageModal: React.FC<CategoryManageModalProps> = ({
  isVisible,
  onClose,
  categoryName,
}) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName);

  useEffect(() => {
    if (isVisible) {
      setNewCategoryName(categoryName);
    }
  }, [isVisible, categoryName]);

  const handleClose = () => {
    setNewCategoryName(categoryName);
    onClose();
  };

  const handleRename = async () => {
    try {
      await renameCategory(categoryName, newCategoryName);
      onClose();
    } catch (error) {
      console.error("Failed to rename category:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(categoryName);
      onClose();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // renders modal with input for category name and action buttons (update or delete)
  return (
    <Modal
      title="Manage Category"
      width={350}
      open={isVisible}
      onCancel={handleClose}
      footer={null}
    >
      <Input
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        onClick={handleRename}
        type="primary"
        style={{ marginRight: 8 }}
        disabled={newCategoryName === categoryName || !newCategoryName.trim()}
      >
        Rename
      </Button>
      <Popconfirm
        title="Are you sure? This action is not recoverable and will delete all subcategories within it."
        icon={<ExclamationCircleOutlined style={{ color: "#BF0018" }} />}
        onConfirm={handleDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <Button danger>Delete</Button>
      </Popconfirm>
    </Modal>
  );
};

export default CategoryManageModal;

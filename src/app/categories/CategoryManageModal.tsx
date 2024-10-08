"use client";

import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Popconfirm } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { renameCategory, deleteCategory } from "./actions";

interface CategoryManageModalProps {
  isVisible: boolean;
  onClose: () => void;
  categoryName: string;
}

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

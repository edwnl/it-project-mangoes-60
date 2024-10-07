"use client";

import React from "react";
import { Modal } from "antd";

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
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title="Manage Category"
      width={350}
      open={isVisible}
      onCancel={handleClose}
      footer={null}
    >
      <p>Edit Category</p>
    </Modal>
  );
};

export default CategoryManageModal;

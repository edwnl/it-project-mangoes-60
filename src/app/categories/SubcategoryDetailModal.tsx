"use client";

import React from "react";
import { Modal } from "antd";
import { Subcategory } from "@/types/types";

interface SubcategoryDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  subcategory: Subcategory;
  isAdmin: boolean;
}

const SubcategoryDetailModal: React.FC<SubcategoryDetailModalProps> = ({
  isVisible,
  onClose,
}) => {

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title="Subcategory Details"
      open={isVisible}
      className={"top-10"}
      width={350}
      onCancel={handleClose}
      footer={null}
    >
      <p>Subcategory Details</p>
    </Modal>
  );
};

export default SubcategoryDetailModal;

// File: src/components/ConfirmModal.tsx
"use client";

import React from "react";
import { Modal } from "antd";
import { SearchResult } from "@/types/SearchTypes";

interface ConfirmModalProps {
  isVisible: boolean;
  selectedItem: SearchResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  selectedItem,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="Confirm Category Selection"
      open={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={selectedItem ? "Confirm Selection" : "Yes, mark all as incorrect"}
      cancelText="Cancel"
    >
      {selectedItem ? (
        <p>
          Are you sure you want to select "{selectedItem.subcategory_name}" as
          the correct category?
        </p>
      ) : (
        <p>Are you sure you want to mark all results as incorrect?</p>
      )}
    </Modal>
  );
};

export default ConfirmModal;

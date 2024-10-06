"use client";

import React from "react";
import { Modal } from "antd";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      title="Filter by Category"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        {}
        <p>Filter options</p>
      </div>
    </Modal>
  );
};

export default FilterModal;
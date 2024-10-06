"use client";

import React from "react";
import { Modal, Button } from "antd";

interface CreateSubcategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CreateSubcategoryModal: React.FC<CreateSubcategoryModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      title="New Sub-Category"
      open={isVisible}
      width={350}
      className={"top-8"}
      onCancel={onClose}
      footer={null}
    >
      <div>
        {}
        <p>Create options will go here</p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          className="custom-button"
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default CreateSubcategoryModal;
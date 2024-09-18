// File: src/components/ImageModal.tsx
"use client";

import React from "react";
import { Modal } from "antd";
import Image from "next/image";

interface ImageModalProps {
  isVisible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isVisible,
  imageUrl,
  onClose,
}) => {
  return (
    <Modal
      title="Searched Image"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Searched Image"
          width={400}
          height={400}
          className="object-contain"
        />
      )}
    </Modal>
  );
};

export default ImageModal;

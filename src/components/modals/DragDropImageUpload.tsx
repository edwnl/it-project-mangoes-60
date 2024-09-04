"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Modal } from "antd";
import { UploadOutlined, XOutlined } from "@ant-design/icons";

interface DragDropImageUploadProps {
  isVisible: boolean;
  onClose: () => void;
  onImageConfirm: (file: File) => Promise<void>;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  isVisible,
  onClose,
  onImageConfirm,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleConfirm = async () => {
    if (file) {
      await onImageConfirm(file);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      removeFile();
    }
  }, [isVisible]);

  const modalContent = (
    <div className="w-full mx-auto p-4">
      {!file && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <UploadOutlined className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag 'n' drop an image here, or click to select a file
          </p>
        </div>
      )}

      {file && preview && (
        <div className="mt-4">
          <div className="relative inline-block">
            <img
              src={preview}
              alt={file.name}
              className="object-cover rounded-md"
            />
            <button
              onClick={removeFile}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            >
              <XOutlined size={16} />
            </button>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleConfirm}
              type="primary"
              className="custom-button"
            >
              Confirm Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      title="Upload Image for Search"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {modalContent}
    </Modal>
  );
};

export default DragDropImageUpload;

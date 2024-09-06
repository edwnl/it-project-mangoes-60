"use client";

import React, { useState } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadProps } from "antd/es/upload/interface";

interface DragDropImageUploadProps {
  onSearchResult: (formData: FormData) => Promise<void>;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  onSearchResult,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      const localImageUrl = URL.createObjectURL(
        info.file.originFileObj as Blob,
      );
      setImageUrl(localImageUrl);
      processImage(info.file.originFileObj as RcFile);
    }
  };

  const processImage = async (file: RcFile) => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await onSearchResult(formData);
    } catch (error) {
      console.error("Error processing file:", error);
      message.error("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center h-full">
      <PlusOutlined />
      <div className="mt-2">Drag'n drop or click to select an image</div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto ">
      <ImgCrop
        modalOk={"Search Now"}
        modalProps={{
          okButtonProps: {
            className: "custom-button",
          },
        }}
        aspect={1}
        quality={1}
        modalTitle="Crop Image"
        modalWidth={500}
      >
        <Upload
          listType="picture-card"
          showUploadList={false}
          className="rounded-lg overflow-hidden"
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
              message.error("You can only upload JPG/PNG file!");
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error("Image must smaller than 2MB!");
            }
            return isJpgOrPng && isLt2M;
          }}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default DragDropImageUpload;

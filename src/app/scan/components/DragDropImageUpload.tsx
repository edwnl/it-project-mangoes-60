"use client";

import React, { useState } from "react";
import { Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadProps } from "antd/es/upload/interface";

interface DragDropImageUploadProps {
  onSearchResult: (formData: FormData) => Promise<void>;
  immediateUpload?: boolean;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  onSearchResult,
  immediateUpload = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedFile, setCroppedFile] = useState<RcFile | null>(null);

  // handle image upload and cropping
  const handleChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "done") {
      const localImageUrl = URL.createObjectURL(
        info.file.originFileObj as Blob,
      );
      setImageUrl(localImageUrl);
      setCroppedFile(info.file.originFileObj as RcFile);

      if (immediateUpload) {
        await processImage(info.file.originFileObj as RcFile);
      }
    }
  };

  // process the uploaded image
  const processImage = async (file: RcFile | null = null) => {
    const fileToProcess = file || croppedFile;
    if (!fileToProcess) {
      message.error("No image selected");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", fileToProcess);

    try {
      await onSearchResult(formData);
    } catch (error) {
      console.error("Error processing file:", error);
      message.error("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  // upload button UI
  const uploadButton = (
    <div className="flex flex-col items-center justify-center h-full">
      <PlusOutlined />
      <div className="mt-2">Drag'n drop or click to select an image</div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* image upload and crop component */}
      <ImgCrop
        modalOk="Crop"
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
      {/* search button (shown only if not immediate upload) */}
      {croppedFile && !immediateUpload && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => processImage()}
            disabled={isProcessing}
            className="custom-button"
          >
            {isProcessing ? "Searching..." : "Search Now"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DragDropImageUpload;

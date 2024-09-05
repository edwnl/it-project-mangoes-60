"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { message } from "antd";

interface FileWithPreview extends File {
  preview: string;
}

const DragDropImageUpload: React.FC<{
  onSearchResult: (formData: FormData) => Promise<void>;
  onSearchStateChange: (isSearching: boolean) => void;
}> = ({ onSearchResult, onSearchStateChange }) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false, // Changed to false to match CameraComponent behavior
  });

  const removeFile = (file: FileWithPreview) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const processImage = async () => {
    if (files.length === 0) {
      message.error("Please select an image first");
      return;
    }

    setIsProcessing(true);
    onSearchStateChange(true);

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await onSearchResult(formData);
    } catch (error) {
      console.error("Error processing file:", error);
      message.error("Failed to process image");
    } finally {
      setIsProcessing(false);
      onSearchStateChange(false);
      setFiles([]); // Clear the file after processing
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div
        {...getRootProps()}
        className={`p-20 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-24 w-24 text-gray-400" />
        <p className="mt-4 text-lg text-gray-600">
          Drag 'n' drop an image here, or click to select a file
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="relative inline-block">
            <img
              src={files[0].preview}
              alt={files[0].name}
              className="h-48 object-cover rounded-md"
            />
            <button
              onClick={() => removeFile(files[0])}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={processImage}
          disabled={isProcessing}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 text-lg mx-auto block custom-button"
        >
          {isProcessing ? "Processing..." : "Analyze Image"}
        </button>
      )}
    </div>
  );
};

export default DragDropImageUpload;

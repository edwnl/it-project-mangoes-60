"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { imageSearch } from "@/api/search/imageSearch";

interface FileWithPreview extends File {
  preview: string;
  categories?: any[];
}

const DragDropImageUpload: React.FC<{
  onSearchResult: (result: any) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}> = ({ onSearchResult, onSearchStateChange }) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

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
    multiple: true,
  });

  const removeFile = (file: FileWithPreview) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    setUploading(true);
    onSearchStateChange(true);
    const updatedFiles = [...files];
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await imageSearch(formData);
        if (result.success) {
          updatedFiles[i] = { ...file, categories: result.data };
          onSearchResult(result);
        } else {
          throw new Error(result.error || "Analysis failed");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        onSearchResult({
          success: false,
          error: "Failed to process image",
        });
      }
    }
    setUploading(false);
    onSearchStateChange(false);
    setFiles(updatedFiles);
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
          Drag 'n' drop some images here, or click to select files
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 grid gap-4">
          {files.map((file) => (
            <div key={file.name} className="relative inline-block">
              <img
                src={file.preview}
                alt={file.name}
                className="h-28 object-cover rounded-md"
              />
              <button
                onClick={() => removeFile(file)}
                className="absolute top-0 left-0 p-1 bg-red-500 text-white rounded-full"
              >
                <X size={16} />
              </button>
              {file.categories && (
                <div className="mt-2">
                  {file.categories.map((category, index) => (
                    <p
                      key={index}
                      className="text-center text-sm text-gray-600"
                    >
                      {category.box_name}: {category.confidence.toFixed(2)}%
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          disabled={uploading}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 text-lg mx-auto block"
        >
          {uploading ? "Analyzing..." : "Analyse Images"}
        </button>
      )}
    </div>
  );
};

export default DragDropImageUpload;

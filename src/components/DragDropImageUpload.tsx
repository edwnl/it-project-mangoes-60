'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface FileWithPreview extends File {
  preview: string;
  category?: string;
}

const DragDropImageUpload: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    ));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  const removeFile = (file: FileWithPreview) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    setUploading(true);
    const updatedFiles = [...files];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        updatedFiles[i] = { ...file, category: data.category };
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error (e.g., show error message)
      }
    }
    setUploading(false);
    setFiles(updatedFiles);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag 'n' drop some images here, or click to select files
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {files.map((file) => (
            <div key={file.name} className="relative">
              <img
                src={file.preview}
                alt={file.name}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                onClick={() => removeFile(file)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                <X size={16} />
              </button>
              {file.category && (
                <p className="mt-1 text-sm text-gray-600">Category: {file.category}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          disabled={uploading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? 'Analyzing...' : 'Analyze Images'}
        </button>
      )}
    </div>
  );
};

export default DragDropImageUpload;
import React from "react";
import CameraComponent from "@/components/CameraComponent";

const CameraPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Camera Capture Page</h1>

      <p className="mb-6">
        Welcome to our camera capture feature. This tool allows you to take a
        photo using your device's camera. Simply click the "Start Camera" button
        to begin, then capture your image. You'll have the option to retake or
        confirm your photo once it's captured.
      </p>

      <CameraComponent />

      <p className="mt-6 text-sm text-gray-600">
        Note: This feature requires camera permissions. Please ensure you've
        granted access when prompted.
      </p>
    </div>
  );
};

export default CameraPage;

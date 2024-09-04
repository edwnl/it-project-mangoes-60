"use client";

import React, { useRef, useState, useCallback } from "react";
import { Camera } from "lucide-react";
import { Button } from "antd";

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async (): Promise<void> => {
    try {
      const mediaStream: MediaStream =
        await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  }, []);

  const stopCamera = useCallback((): void => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback((): void => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback((): void => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback((): void => {
    console.log("Photo confirmed:", capturedImage);
    // Implement your confirmation logic here
  }, [capturedImage]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {!capturedImage ? (
        <>
          <div className="relative w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            onClick={stream ? captureImage : startCamera}
            className="flex items-center"
          >
            <Camera className="mr-2" />
            {stream ? "Capture" : "Start Camera"}
          </Button>
        </>
      ) : (
        <>
          <div className="w-64 h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-4">
            <Button onClick={retakePhoto}>Retake</Button>
            <Button onClick={confirmPhoto}>Confirm</Button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" width="640" height="480" />
    </div>
  );
};

export default CameraComponent;

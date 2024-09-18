"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { imageSearch } from "@/api/search/imageSearch";
import CameraButton from "@/components/CameraButton";

const SQUARE_SIZE = 300;
const MAX_UPLOAD_SIZE = 512;

const CameraComponent: React.FC<{
  onSearchResult: (result: any) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}> = ({ onSearchResult, onSearchStateChange }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startCamera = useCallback(async (): Promise<void> => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "environment",
          width: { ideal: SQUARE_SIZE },
          height: { ideal: SQUARE_SIZE },
        },
      };

      const mediaStream: MediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      message.error("Error accessing the camera.");
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
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        const size = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        canvas.width = SQUARE_SIZE;
        canvas.height = SQUARE_SIZE;

        context.drawImage(
          video,
          startX,
          startY,
          size,
          size,
          0,
          0,
          SQUARE_SIZE,
          SQUARE_SIZE,
        );

        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const processAndUploadImage = async (imageDataUrl: string) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = Math.min(
        MAX_UPLOAD_SIZE / img.width,
        MAX_UPLOAD_SIZE / img.height,
      );
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("file", blob, "image.jpg");

            try {
              setIsProcessing(true);
              onSearchStateChange(true); // Notify parent that search is starting
              const result = await imageSearch(formData);
              onSearchResult(result);
            } catch (error) {
              console.error("Error processing image:", error);
              message.error("Failed to process image");
              onSearchResult({
                success: false,
                error: "Failed to process image",
              });
            } finally {
              setIsProcessing(false);
              onSearchStateChange(false); // Notify parent that search has ended
            }
          }
        },
        "image/jpeg",
        0.8,
      );
    };
    img.src = imageDataUrl;
  };

  const confirmPhoto = useCallback(async (): Promise<void> => {
    if (capturedImage) {
      await processAndUploadImage(capturedImage);
    }
  }, [capturedImage, onSearchResult]);

  const retakePhoto = useCallback((): void => {
    setCapturedImage(null);
    onSearchResult(null);
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setAttribute("playsinline", "true");
      videoRef.current.setAttribute("muted", "true");
      videoRef.current.setAttribute("autoplay", "true");
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {!capturedImage ? (
        <>
          <div
            className="relative bg-gray-200 rounded-lg overflow-hidden"
            style={{ width: `${SQUARE_SIZE}px`, height: `${SQUARE_SIZE}px` }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
            />
          </div>
          {!stream ? (
            <Button
              className="flex items-center custom-button rounded-full"
              onClick={startCamera}
            >
              <CameraOutlined className="mr-2" />
              Start Camera
            </Button>
          ) : (
            <CameraButton onClick={captureImage} />
          )}
        </>
      ) : (
        <>
          <div
            className="bg-gray-200 rounded-lg overflow-hidden"
            style={{ width: `${SQUARE_SIZE}px`, height: `${SQUARE_SIZE}px` }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-4">
            <Button onClick={retakePhoto} disabled={isProcessing}>
              Retake
            </Button>
            <Button
              className="custom-button"
              onClick={confirmPhoto}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraComponent;

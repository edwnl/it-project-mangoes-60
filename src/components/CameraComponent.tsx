"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";

const SQUARE_SIZE = 300; // Define the size of our square photo

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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
        // Calculate the square crop
        const size = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        // Set canvas to our desired SQUARE_SIZE
        canvas.width = SQUARE_SIZE;
        canvas.height = SQUARE_SIZE;

        // Draw the cropped and resized image
        context.drawImage(
          video,
          startX,
          startY,
          size,
          size, // Source rectangle
          0,
          0,
          SQUARE_SIZE,
          SQUARE_SIZE, // Destination rectangle
        );

        const imageDataUrl = canvas.toDataURL("image/jpeg");
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
          <Button
            onClick={stream ? captureImage : startCamera}
            className="flex items-center custom-button"
          >
            <CameraOutlined className="mr-2" />
            {stream ? "Capture" : "Start Camera"}
          </Button>
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
            <Button onClick={retakePhoto}>Retake</Button>
            <Button className="custom-button" onClick={confirmPhoto}>
              Confirm
            </Button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraComponent;

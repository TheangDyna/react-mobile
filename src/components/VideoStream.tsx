import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VideoStream = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [fakeResponse, setFakeResponse] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); // Store media stream

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      });

      mediaStreamRef.current = stream; // Store the media stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks
      mediaStreamRef.current = null; // Clear stored stream
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null; // Release camera resource
    }
  };

  const captureAndProcessFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setProcessing(true);
    setFakeResponse(null); // Clear previous response

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capture the frame from the video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert to Base64 and store the image
    const base64Image = canvas.toDataURL("image/jpeg");
    setCapturedImage(base64Image);

    // Stop camera after capturing
    stopCamera();
    setCameraActive(false);

    // Fake a delay (3 seconds) before showing the "processed" response
    setTimeout(() => {
      setProcessing(false);
      setFakeResponse("✅ Fake AI Result: Image successfully processed!");
    }, 3000); // Simulated delay (adjust as needed)
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setFakeResponse(null);
    setProcessing(false);
    setCameraActive(true); // Restart camera when retaking
  };

  return (
    <div className="flex flex-col items-center p-4 relative">
      <div className="relative w-full max-w-md">
        {/* Camera Preview (Hidden when an image is captured) */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg shadow-lg bg-black w-full"
          />
        ) : (
          capturedImage && (
            <img
              src={capturedImage}
              alt="Captured Frame"
              className="rounded-lg shadow-md w-full"
            />
          )
        )}

        {/* Loading Indicator */}
        {processing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
            <p className="text-white mt-2">Processing...</p>
          </div>
        )}
      </div>

      {/* Fake AI Response */}
      {fakeResponse && (
        <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm w-full max-w-md">
          <h2 className="text-lg font-semibold">AI Response:</h2>
          <pre className="text-xs">{fakeResponse}</pre>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        {capturedImage ? (
          <Button onClick={retakeImage} className="bg-gray-500">
            Retake
          </Button>
        ) : (
          <Button onClick={captureAndProcessFrame} disabled={processing}>
            Capture & Process Frame
          </Button>
        )}
      </div>

      {/* Hidden Canvas for Capturing Frames */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VideoStream;

import { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewPictureOptions,
} from "@capacitor-community/camera-preview";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, RefreshCcw } from "lucide-react";

const CameraScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        await CameraPreview.start({
          parent: "cameraPreview",
          position: "rear",
          toBack: true,
          storeToFile: false,
        });
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    };

    if (!image) {
      startCamera();
    } else {
      CameraPreview.stop();
    }

    return () => {
      CameraPreview.stop();
    };
  }, [image]);

  const handleTakePic = async () => {
    setProcessing(true);

    try {
      const options: CameraPreviewPictureOptions = {
        quality: 100,
      };
      const result = await CameraPreview.capture(options);
      const capturedImage = `data:image/jpeg;base64,${result.value}`;
      setImage(capturedImage);
    } catch (error) {
      console.error("Error capturing image:", error);
    }

    setTimeout(() => {
      setProcessing(false);
    }, 3000);
  };

  const retakeImage = async () => {
    setImage(null);
    setProcessing(false);
  };

  return (
    <div className="relative w-full h-screen">
      {image ? (
        <>
          <img
            src={image}
            alt="Captured Frame"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />
          {processing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
              <p className="text-white mt-2">Processing...</p>
            </div>
          )}
        </>
      ) : (
        <div
          id="cameraPreview"
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      )}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-black bg-opacity-50 flex flex-col items-center">
        <div className="absolute bottom-10 flex items-center justify-center gap-8">
          {image ? (
            <Button
              onClick={retakeImage}
              disabled={processing}
              className="bg-white text-black p-5 rounded-full shadow-lg border-4 border-gray-300"
            >
              <RefreshCcw className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              onClick={handleTakePic}
              className="bg-white text-black p-5 rounded-full shadow-lg border-4 border-gray-300"
            >
              <Camera className="w-8 h-8" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraScanner;

import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from "@capacitor-community/camera-preview";

const App: React.FC = () => {
  CameraPreview.start({ parent: "cameraPreview" });
  const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
    quality: 50,
    width: 600,
    height: 600,
  };

  const handleTakePic = async () => {
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    const base64PictureData = result.value;
    console.log(base64PictureData);
  };
  return (
    <div>
      <div id="cameraPreview" className="" />
      <button onClick={handleTakePic}>Take Pic</button>
    </div>
  );
};

export default App;

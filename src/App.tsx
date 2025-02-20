import VideoStream from "@/components/VideoStream";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Live Video Streaming & Frame Capture
      </h1>
      <VideoStream />
    </div>
  );
}

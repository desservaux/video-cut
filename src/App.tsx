import React, { useState, useCallback } from 'react';
import { Scissors } from 'lucide-react';
import { VideoUploader } from './components/VideoUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { VideoProcessingStatus } from './components/VideoProcessingStatus';
import { VideoControls } from './components/VideoControls';
import { useVideoProcessor } from './hooks/useVideoProcessor';

function App() {
  const {
    videoUrl,
    previewUrl,
    metadata,
    isProcessing,
    error,
    isReady,
    isLoading,
    processVideo,
    previewCut,
    downloadVideo
  } = useVideoProcessor();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeChange = useCallback((start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  }, []);

  const handleVideoLoad = useCallback((file: File) => {
    processVideo(file);
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      setEndTime(video.duration);
    };
  }, [processVideo]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Video Trimmer</h1>
          </div>
          <p className="text-gray-600">Upload a video, set the cut points, and download the trimmed version</p>
        </div>

        <VideoProcessingStatus isLoading={isLoading} error={error} />

        {isReady && !videoUrl ? (
          <VideoUploader onVideoSelect={handleVideoLoad} />
        ) : (
          videoUrl && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Original Video</h2>
                  <VideoPlayer
                    videoUrl={videoUrl}
                    timeRange={{ startTime, endTime }}
                    onTimeUpdate={setCurrentTime}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Preview Cut</h2>
                  {previewUrl ? (
                    <VideoPlayer
                      videoUrl={previewUrl}
                      timeRange={{ startTime: 0, endTime: endTime - startTime }}
                      onTimeUpdate={setCurrentTime}
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {metadata && (
                <>
                  <Timeline
                    duration={metadata.duration}
                    currentTime={currentTime}
                    startTime={startTime}
                    endTime={endTime}
                    onTimeChange={handleTimeChange}
                  />

                  <VideoControls
                    onPreviewClick={() => previewCut(startTime, endTime)}
                    onDownloadClick={downloadVideo}
                    isProcessing={isProcessing}
                    hasPreview={!!previewUrl}
                  />
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
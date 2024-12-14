import React, { useRef, useEffect } from 'react';
import { TimeRange } from '../types/video';

interface VideoPlayerProps {
  videoUrl: string;
  timeRange: TimeRange;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({ videoUrl, timeRange, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= timeRange.endTime) {
        video.currentTime = timeRange.startTime;
      }
      onTimeUpdate?.(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [timeRange, onTimeUpdate]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="w-full rounded-lg shadow-lg"
      controls
    />
  );
}
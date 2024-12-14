import React, { useRef, useEffect } from 'react';
import { formatTime } from '../utils/time';

interface TimelineProps {
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  onTimeChange: (start: number, end: number) => void;
}

export function Timeline({
  duration,
  currentTime,
  startTime,
  endTime,
  onTimeChange,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const time = position * duration;
    
    if (Math.abs(time - startTime) < Math.abs(time - endTime)) {
      onTimeChange(time, endTime);
    } else {
      onTimeChange(startTime, time);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <div 
        ref={timelineRef}
        className="relative h-8 bg-gray-200 rounded mb-2 cursor-pointer"
        onClick={handleTimelineClick}
      >
        <div
          className="absolute h-full bg-blue-200"
          style={{
            left: `${(startTime / duration) * 100}%`,
            width: `${((endTime - startTime) / duration) * 100}%`,
          }}
        />
        <div
          className="absolute w-1 h-full bg-blue-500"
          style={{
            left: `${(currentTime / duration) * 100}%`,
          }}
        />
        <div
          className="absolute w-2 h-full bg-blue-600 cursor-ew-resize"
          style={{ left: `${(startTime / duration) * 100}%` }}
        />
        <div
          className="absolute w-2 h-full bg-blue-600 cursor-ew-resize"
          style={{ left: `${(endTime / duration) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatTime(startTime)}</span>
        <span>{formatTime(endTime)}</span>
      </div>
    </div>
  );
}
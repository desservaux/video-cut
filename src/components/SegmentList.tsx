import React from 'react';
import { Trash2, Play } from 'lucide-react';
import { VideoSegment } from '../types/video';
import { formatTime } from '../utils/time';

interface SegmentListProps {
  segments: VideoSegment[];
  currentSegment: VideoSegment | null;
  onSelectSegment: (segment: VideoSegment) => void;
  onDeleteSegment: (segmentId: string) => void;
}

export function SegmentList({
  segments,
  currentSegment,
  onSelectSegment,
  onDeleteSegment
}: SegmentListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Video Segments</h2>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              currentSegment?.id === segment.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectSegment(segment)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
              <div>
                <p className="font-medium">{segment.label}</p>
                <p className="text-sm text-gray-500">
                  {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDeleteSegment(segment.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {segments.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No segments created yet. Use the timeline to create segments.
          </p>
        )}
      </div>
    </div>
  );
}
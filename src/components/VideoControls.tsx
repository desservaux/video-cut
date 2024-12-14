import React from 'react';
import { Play, Download } from 'lucide-react';

interface VideoControlsProps {
  onPreviewClick: () => void;
  onDownloadClick: () => void;
  isProcessing: boolean;
  hasPreview: boolean;
}

export function VideoControls({
  onPreviewClick,
  onDownloadClick,
  isProcessing,
  hasPreview
}: VideoControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onPreviewClick}
        disabled={isProcessing}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
      >
        <Play className="w-4 h-4" />
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Processing...
          </span>
        ) : (
          'Preview Cut'
        )}
      </button>
      <button
        onClick={onDownloadClick}
        disabled={!hasPreview || isProcessing}
        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  );
}
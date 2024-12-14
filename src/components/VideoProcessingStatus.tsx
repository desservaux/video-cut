import React from 'react';

interface VideoProcessingStatusProps {
  isLoading: boolean;
  error: string | null;
}

export function VideoProcessingStatus({ isLoading, error }: VideoProcessingStatusProps) {
  if (!isLoading && !error) return null;

  return (
    <>
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <p className="text-blue-600">Loading video processing capabilities...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </>
  );
}
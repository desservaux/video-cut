import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
}

export function VideoUploader({ onVideoSelect }: VideoUploaderProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-full max-w-2xl mx-auto p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium text-gray-600">
          Drag and drop your video here or
        </p>
        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
          Browse Files
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
}
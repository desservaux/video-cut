import { VideoMetadata } from '../types/video';

export const loadVideoMetadata = (url: string): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };

    const handleLoadedMetadata = () => {
      cleanup();
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    const handleError = () => {
      cleanup();
      reject(new Error('Failed to load video metadata'));
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.load();
  });
};

export const createVideoUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeVideoUrl = (url: string): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};
import { useState, useCallback } from 'react';
import { VideoMetadata } from '../types/video';
import { ffmpegService } from '../services/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useFFmpeg } from './useFFmpeg';
import { loadVideoMetadata } from '../utils/video';

export function useVideoProcessor() {
  const { isLoaded: isFFmpegLoaded, isLoading: isFFmpegLoading, error: ffmpegError } = useFFmpeg();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processVideo = useCallback(async (file: File) => {
    try {
      if (!isFFmpegLoaded) {
        throw new Error('Video processing is not ready yet. Please wait.');
      }

      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      const videoMetadata = await loadVideoMetadata(url);
      setMetadata(videoMetadata);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video');
      console.error('Video processing error:', err);
    }
  }, [isFFmpegLoaded]);

  const previewCut = useCallback(async (startTime: number, endTime: number) => {
    if (!videoUrl || !isFFmpegLoaded) {
      setError('Please wait for video processing to be ready');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const inputFile = await fetchFile(videoUrl);
      const processedData = await ffmpegService.trimVideo(
        new Uint8Array(await inputFile.arrayBuffer()),
        startTime,
        endTime
      );
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const blob = new Blob([processedData], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      setError('Failed to create video preview. Please try again.');
      console.error('Preview generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [videoUrl, previewUrl, isFFmpegLoaded]);

  const downloadVideo = useCallback(() => {
    if (!previewUrl) {
      setError('No processed video available for download');
      return;
    }
    
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = 'trimmed-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [previewUrl]);

  return {
    videoUrl,
    previewUrl,
    metadata,
    isProcessing,
    error: error || ffmpegError,
    processVideo,
    previewCut,
    downloadVideo,
    isReady: isFFmpegLoaded,
    isLoading: isFFmpegLoading
  };
}
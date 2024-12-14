import { useState, useEffect } from 'react';
import { ffmpegService } from '../services/ffmpeg';

export function useFFmpeg() {
  const [isLoaded, setIsLoaded] = useState(ffmpegService.isLoaded());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  useEffect(() => {
    if (isLoaded) return;

    const loadFFmpeg = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        await ffmpegService.load();
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_DELAY);
          setError('Initializing video processing...');
        } else {
          setError('Failed to initialize video processing. Please refresh the page.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFFmpeg();
  }, [isLoaded, isLoading, retryCount]);

  return { isLoaded, isLoading, error };
}
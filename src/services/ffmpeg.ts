import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

class FFmpegService {
  private ffmpeg: FFmpeg;
  private loaded: boolean = false;
  private loading: Promise<void> | null = null;

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  async load(): Promise<void> {
    if (this.loaded) return;
    
    if (this.loading) {
      return this.loading;
    }

    this.loading = (async () => {
      try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        
        await this.ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        
        this.loaded = true;
      } catch (error) {
        this.loaded = false;
        console.error('FFmpeg loading error:', error);
        throw error;
      } finally {
        this.loading = null;
      }
    })();

    return this.loading;
  }

  async trimVideo(
    videoFile: Uint8Array,
    startTime: number,
    endTime: number
  ): Promise<Uint8Array> {
    if (!this.loaded) {
      throw new Error('FFmpeg is not loaded');
    }

    try {
      await this.ffmpeg.writeFile('input.mp4', videoFile);

      const duration = endTime - startTime;
      await this.ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', this.formatTime(startTime),
        '-t', this.formatTime(duration),
        '-c:v', 'copy',
        '-c:a', 'copy',
        'output.mp4'
      ]);

      const data = await this.ffmpeg.readFile('output.mp4');
      await this.cleanup();
      return new Uint8Array(data);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  private async cleanup(): Promise<void> {
    try {
      await this.ffmpeg.deleteFile('input.mp4');
      await this.ffmpeg.deleteFile('output.mp4');
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  }

  private formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}

export const ffmpegService = new FFmpegService();
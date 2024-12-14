import { VideoSegment } from '../types/video';

export const createSegment = (
  startTime: number,
  endTime: number,
  existingSegments: VideoSegment[]
): VideoSegment => {
  const id = crypto.randomUUID();
  const segmentNumber = existingSegments.length + 1;
  
  return {
    id,
    startTime,
    endTime,
    label: `Segment ${segmentNumber}`
  };
};

export const sortSegments = (segments: VideoSegment[]): VideoSegment[] => {
  return [...segments].sort((a, b) => a.startTime - b.startTime);
};

export const validateSegment = (
  segment: VideoSegment,
  segments: VideoSegment[],
  duration: number
): boolean => {
  if (segment.startTime < 0 || segment.endTime > duration || segment.startTime >= segment.endTime) {
    return false;
  }

  return !segments.some(
    s => s.id !== segment.id && (
      (segment.startTime >= s.startTime && segment.startTime < s.endTime) ||
      (segment.endTime > s.startTime && segment.endTime <= s.endTime)
    )
  );
};
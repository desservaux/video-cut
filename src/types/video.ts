export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export interface TimeRange {
  startTime: number;
  endTime: number;
}

export interface VideoSegment extends TimeRange {
  id: string;
  label: string;
}
export interface FrameStats {
  fps: number;
  resolution: string;
  processingTime: number; // in milliseconds
  timestamp: number;
}

export interface FrameData {
  imageUrl: string;
  stats: FrameStats;
}

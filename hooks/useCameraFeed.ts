import { useRef, useCallback, useEffect } from 'react';
import { FrameData } from '../types';

export const useCameraFeed = (
  onNewFrame: (frame: FrameData) => void,
  onError: (error: string) => void
) => {
  const intervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const onNewFrameRef = useRef(onNewFrame);
  useEffect(() => {
    onNewFrameRef.current = onNewFrame;
  }, [onNewFrame]);
  
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const captureFrame = useCallback((fps: number) => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Don't capture if video has no dimensions yet
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg');
    
    const frameData: FrameData = {
      imageUrl,
      stats: {
        fps: fps,
        resolution: `${canvas.width}x${canvas.height}`,
        processingTime: Math.floor(5 + Math.random() * 5), // Simulate 5-10ms processing time
        timestamp: Date.now(),
      },
    };
    onNewFrameRef.current(frameData);
  }, []);

  const start = useCallback(async (fps: number) => {
    if (intervalRef.current !== null) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;

      videoRef.current = document.createElement('video');
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.play();

      canvasRef.current = document.createElement('canvas');

      intervalRef.current = window.setInterval(() => {
        captureFrame(fps);
      }, 1000 / fps);
    } catch (err) {
      console.error("Camera access error:", err);
      let message = 'Could not access the camera. Please ensure permissions are granted.';
      if (err instanceof Error) {
          if (err.name === "NotAllowedError") {
              message = "Camera permission was denied. Please grant permission and try again.";
          } else if (err.name === "NotFoundError") {
              message = "No camera was found on this device.";
          }
      }
      onErrorRef.current(message);
      // Re-throw to be caught in App.tsx
      throw err;
    }
  }, [captureFrame]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    videoRef.current = null;
    canvasRef.current = null;
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    }
  }, [stop]);

  return { start, stop };
};

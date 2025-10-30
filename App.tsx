import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageViewer } from './components/ImageViewer';
import { Controls } from './components/Controls';
import { FrameData } from './types';
import { useCameraFeed } from './hooks/useCameraFeed';
import { AlertTriangleIcon, XIcon } from './components/icons';

const App: React.FC = () => {
  const [frame, setFrame] = useState<FrameData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(15);
  const [error, setError] = useState<string | null>(null);

  const lastFrameTimeRef = useRef(0);

  const handleNewFrame = useCallback((newFrame: FrameData) => {
    const now = performance.now();
    const interval = 1000 / fps;
    if (now - lastFrameTimeRef.current >= interval) {
      setFrame(newFrame);
      lastFrameTimeRef.current = now;
    }
  }, [fps]);
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsPlaying(false);
  };
  
  const clearError = () => setError(null);

  const { start, stop } = useCameraFeed(handleNewFrame, handleError);

  const handleStart = async () => {
    clearError();
    lastFrameTimeRef.current = 0; // Reset timer for immediate first frame
    try {
      await start(fps);
      setIsPlaying(true);
    } catch (err) {
      // Error is already handled by the hook's callback, but we catch here to prevent unhandled promise rejections
      console.log("Start failed, error was handled.");
    }
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    setFrame(null);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-['Orbitron'] p-4 flex flex-col items-center">
      {error && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-black/80 backdrop-blur-sm border border-red-500/50 rounded-lg shadow-lg shadow-red-500/20 p-4 flex items-start gap-4">
           <div className="flex-shrink-0 text-red-500">
             <AlertTriangleIcon className="h-6 w-6 neon-glow" />
           </div>
           <div className="flex-grow">
             <h3 className="font-bold text-red-400 neon-glow">Error</h3>
             <p className="text-sm text-red-400">{error}</p>
           </div>
           <button onClick={clearError} className="text-red-400 hover:text-red-300">
             <XIcon className="h-5 w-5" />
           </button>
         </div>
      )}
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          <ImageViewer frame={frame} />
          <div className="mt-8">
            <Controls
              isPlaying={isPlaying}
              onStart={handleStart}
              onStop={handleStop}
              fps={fps}
              onFpsChange={setFps}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
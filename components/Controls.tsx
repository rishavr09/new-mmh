import React from 'react';
import { PlayIcon, StopIcon } from './icons';

interface ControlsProps {
  isPlaying: boolean;
  onStart: () => void;
  onStop: () => void;
  fps: number;
  onFpsChange: (fps: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ isPlaying, onStart, onStop, fps, onFpsChange }) => {
  const baseButtonClass = "font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all duration-300 border-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const startButtonClass = `${baseButtonClass} border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-[0_0_15px_theme(colors.green.500)]`;
  const stopButtonClass = `${baseButtonClass} border-red-500 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_theme(colors.red.500)]`;

  return (
    <div className="p-6 bg-black/50 backdrop-blur-sm rounded-lg border-2 border-gray-700/50 flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="flex items-center gap-4">
        {!isPlaying ? (
          <button onClick={onStart} className={startButtonClass}>
            <PlayIcon className="h-6 w-6" />
            <span className="neon-glow">Start Stream</span>
          </button>
        ) : (
          <button onClick={onStop} className={stopButtonClass}>
            <StopIcon className="h-6 w-6" />
            <span className="neon-glow">Stop Stream</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <label htmlFor="fps-slider" className="font-bold text-lg text-cyan-300 neon-glow">FPS</label>
        <input
          id="fps-slider"
          type="range"
          min="1"
          max="30"
          step="1"
          value={fps}
          onChange={(e) => onFpsChange(Number(e.target.value))}
          className="w-full md:w-48"
          disabled={isPlaying}
        />
        <span className="bg-black border border-cyan-500/50 text-cyan-300 font-bold px-4 py-2 rounded-md w-16 text-center neon-glow">
          {fps}
        </span>
      </div>
    </div>
  );
};

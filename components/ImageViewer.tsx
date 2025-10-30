import React, { useState } from 'react';
import { FrameData } from '../types';
import { RAW_IMAGE_BASE64 } from '../constants';

interface ImageViewerProps {
  frame: FrameData | null;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-black/50 p-3 rounded-lg text-center border border-fuchsia-500/30 shadow-md shadow-fuchsia-500/10">
    <p className="text-sm text-fuchsia-400 neon-glow">{label}</p>
    <p className="text-lg font-semibold text-cyan-300 neon-glow">{value}</p>
  </div>
);

export const ImageViewer: React.FC<ImageViewerProps> = ({ frame }) => {
  const [selectedFilter, setSelectedFilter] = useState('default');

  const filterStyleMap: { [key: string]: string } = {
    default: 'grayscale(1) contrast(2.5) invert(1) drop-shadow(0 0 3px #0ff)',
    none: '',
    grayscale: 'grayscale(1)',
    sepia: 'sepia(1)',
    invert: 'invert(1)',
  };

  const currentFilter = { filter: filterStyleMap[selectedFilter] };

  const imageContainerStyle = "aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20";
  const imageStyle = "w-full h-full object-contain";

  return (
    <div className="mb-8 p-4 bg-black/50 backdrop-blur-sm rounded-lg border-2 border-gray-700/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <h2 className="text-xl font-bold mb-3 text-center text-cyan-300 neon-glow">Raw Camera Input</h2>
          <div className={imageContainerStyle}>
            {frame ? (
              <img src={frame.imageUrl} alt="Raw video frame" className={imageStyle} />
            ) : (
              <img src={RAW_IMAGE_BASE64} alt="Placeholder raw input" className={imageStyle} />
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-cyan-300 neon-glow">Processed Output</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-select" className="text-sm font-medium text-fuchsia-400 neon-glow">Filter:</label>
              <select
                id="filter-select"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-black border border-cyan-500/50 text-cyan-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-1.5 neon-glow"
              >
                <option value="default">Edge Detect (Sim.)</option>
                <option value="none">None</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
                <option value="invert">Invert</option>
              </select>
            </div>
          </div>
          <div className={imageContainerStyle}>
            {frame ? (
              <img
                src={frame.imageUrl}
                alt="Processed video frame"
                className={imageStyle}
                style={currentFilter}
              />
            ) : (
              <img
                src={RAW_IMAGE_BASE64}
                alt="Placeholder processed output"
                className={imageStyle}
                style={currentFilter}
              />
            )}
          </div>
        </div>
      </div>

      {frame ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="FPS" value={frame.stats.fps.toFixed(1)} />
          <StatCard label="Resolution" value={frame.stats.resolution} />
          <StatCard label="Processing Time" value={`${frame.stats.processingTime} ms`} />
          <StatCard label="Timestamp" value={new Date(frame.stats.timestamp).toLocaleTimeString()} />
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-2xl text-cyan-700/50 neon-glow">Awaiting Datastream...</p>
        </div>
      )}
    </div>
  );
};
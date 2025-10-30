import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/50 backdrop-blur-sm border-b-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 text-center py-4">
      <h1 className="text-3xl font-bold text-cyan-300 neon-glow">
        Real-Time Edge Detection Viewer
      </h1>
      <p className="text-fuchsia-400 text-sm mt-1 neon-glow">
        Powered by OpenCV + OpenGL + TypeScript
      </p>
    </header>
  );
};

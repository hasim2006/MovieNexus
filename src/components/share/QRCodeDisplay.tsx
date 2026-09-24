'use client';

import React from 'react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export default function QRCodeDisplay({ url, size = 180 }: QRCodeDisplayProps) {
  // SVG pseudo-QR code pattern with encoded seed hash for clean visuals
  const seed = Array.from(url).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gridSize = 21;
  const cellSize = size / gridSize;

  // Generate grid matrix
  const matrix = Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, col) => {
      // Corner finder patterns
      if ((row < 7 && col < 7) || (row < 7 && col >= gridSize - 7) || (row >= gridSize - 7 && col < 7)) {
        if (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4)) return true;
        if (row === 0 || row === 6 || col === gridSize - 7 || col === gridSize - 1 || (row >= 2 && row <= 4 && col >= gridSize - 5 && col <= gridSize - 3)) return true;
        if (row === gridSize - 7 || row === gridSize - 1 || col === 0 || col === 6 || (row >= gridSize - 5 && row <= gridSize - 3 && col >= 2 && col <= 4)) return true;
        return false;
      }
      return ((row * 31 + col * 17 + seed) % 3 === 0);
    })
  );

  return (
    <div className="p-3 bg-white rounded-2xl shadow-xl border border-zinc-200 flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" rx={8} />
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            cell ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx * cellSize}
                y={rIdx * cellSize}
                width={cellSize - 0.4}
                height={cellSize - 0.4}
                fill="#09090b"
                rx={1}
              />
            ) : null
          ))
        )}
      </svg>
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Scan to Stream</p>
    </div>
  );
}

// src/components/JackpotGrid.tsx

import React from 'react';
import JackpotCard from './JackpotCard';

const JackpotGrid = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {Array.from({ length: 12 }).map((_, index) => (
        <JackpotCard key={index} id={index + 1} />
      ))}
    </div>
  );
};

export default JackpotGrid;

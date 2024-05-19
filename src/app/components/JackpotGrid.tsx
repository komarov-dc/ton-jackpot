import React, { useEffect, useState } from 'react';
import JackpotCard from './JackpotCard';

const JackpotGrid = () => {
  const [jackpotCount, setJackpotCount] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchJackpotCount = async () => {
      try {
        const response = await fetch('/api/jackpots/count');
        const data = await response.json();
        setJackpotCount(BigInt(data.count));
      } catch (error) {
        console.error('Error fetching jackpot count:', error);
      }
    };

    fetchJackpotCount();
  }, []);

  if (jackpotCount === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {Array.from({ length: parseInt(jackpotCount.toString()) }).map((_, index) => (
        <JackpotCard key={index} id={jackpotCount - (BigInt(index + 1))} />
      ))}
    </div>
  );
};

export default JackpotGrid;

// src/components/JackpotCard.tsx

import React, { useEffect, useState } from 'react';

interface JackpotCardProps {
  id: string; // Changed to string for easier handling with API endpoint
}

const JackpotCard: React.FC<JackpotCardProps> = ({ id }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/jackpots/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching jackpot data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group rounded-lg border border-transparent p-5 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
      <h3 className="mb-3 text-xl font-semibold">Jackpot #{data.id}</h3>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Creator: {data.creator ? data.creator : 'N/A'}</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Goal Price: {data.goalPrice}</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Minimum Bet: {data.minBet}</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">NFT: {data.nft ? data.nft : 'N/A'}</p>
    </div>
  );
};

export default JackpotCard;

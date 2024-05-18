// src/components/JackpotCard.tsx

import React, { useEffect, useState } from 'react';

interface JackpotCardProps {
  id: number;
}

const JackpotCard: React.FC<JackpotCardProps> = ({ id }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/jackpots/${id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching jackpot data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group rounded-lg border border-transparent p-5 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
      <h3 className="mb-3 text-xl font-semibold">Jackpot {data.name}</h3>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">{data.description}</p>
    </div>
  );
};

export default JackpotCard;

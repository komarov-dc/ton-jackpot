import React, { useEffect, useState, useRef } from 'react';
import JackpotCard from './JackpotCard';
import { getJackPotContractAddresses, getJackpotInfo } from '../../services/tonClientService';

const JackpotGrid = () => {
  const [jackpots, setJackpots] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const LOAD_STEP = 10;
  const isFetching = useRef<boolean>(false); // Ref to track fetching state

  const loadMoreJackpots = async () => {
    if (loading || isFetching.current) return; // Prevent multiple calls
    setLoading(true);
    isFetching.current = true; // Set fetching state

    try {
      const addresses = await getJackPotContractAddresses(LOAD_STEP);
      const newJackpots:any[] = [];

      for (const address of addresses) {
        const jackpot = await getJackpotInfo(address);
        newJackpots.push(jackpot);
      }

      setJackpots(prev => [...prev, ...newJackpots]);
      setLoadedCount(prev => prev + addresses.length);
    } catch (error) {
      console.error('Error fetching jackpots:', error);
      setError('Error fetching jackpots');
    } finally {
      setLoading(false);
      isFetching.current = false; // Reset fetching state
    }
  };

  useEffect(() => {
    if (jackpots.length === 0) {
      loadMoreJackpots();
    }
  }, []); // Only run on mount

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="jackpot-grid mt-8">
        {jackpots.map((jackpot, index) => (
          <JackpotCard key={index} jackpot={jackpot} />
        ))}
      </div>
      <button
        onClick={loadMoreJackpots}
        disabled={loading}
        className="mt-4 bg-gray-900 text-white px-4 py-2 rounded"
      >
        {loading ? 'Loading...' : 'Load more'}
      </button>
    </div>
  );
};

export default JackpotGrid;

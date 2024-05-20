import React, { useEffect, useState } from 'react';
import JackpotCard from './JackpotCard';
import { getJackPotContractAddresses, getJackpotInfo } from '../../services/tonClientService';

const JackpotGrid = () => {
  const [jackpots, setJackpots] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  const LOAD_STEP = 10;

  useEffect(() => {
    if (jackpots.length === 0) {
      loadMoreJackpots();
    }
  }, []); // Only run on mount

  const loadMoreJackpots = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const addresses = await getJackPotContractAddresses(LOAD_STEP, loadedCount > 0 ? lastTransactionLT : null);
      const newJackpots = [];

      for (const address of addresses) {
        const jackpot = await getJackpotInfo(address);
        newJackpots.push(jackpot);
      }

      setJackpots(prev => [...prev, ...newJackpots]);
      setLoadedCount(prev => prev + addresses.length);
    } catch (error) {
      console.error('Error fetching jackpots:', error);
      setError('Error fetching jackpots');
    }

    setLoading(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

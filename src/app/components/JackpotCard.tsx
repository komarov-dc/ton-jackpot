// src/components/JackpotCard.tsx

import React, { useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface JackpotCardProps {
  jackpot: {
    id: string;
    creator: string;
    goalPrice: string;
    minBet: string;
    nft: string;
    deadline: string;
  };
}

const JackpotCard: React.FC<JackpotCardProps> = ({ jackpot }) => {
  const [showBetField, setShowBetField] = useState(false);
  const [betAmount, setBetAmount] = useState('');

  const handleCardClick = () => {
    setShowBetField(true);
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetSubmit = () => {
    // Handle bet submission logic here
    alert(`Bet submitted: ${betAmount}`);
  };

  const formatTON = (amount: string) => (BigInt(amount) / BigInt(1e9)).toString();

  return (
    <div onClick={handleCardClick} className="group rounded-lg border border-transparent p-5 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30 cursor-pointer">
      <h3 className="mb-3 text-xl font-semibold">Jackpot #{jackpot.id}</h3>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Creator: {jackpot.creator ? jackpot.creator : 'N/A'}</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Goal Price: {formatTON(jackpot.goalPrice)} TON</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Minimum Bet: {formatTON(jackpot.minBet)} TON</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">NFT: {jackpot.nft ? jackpot.nft : 'N/A'}</p>
      <p className="m-0 max-w-[30ch] text-sm opacity-70">Ends at: {+jackpot.deadline ? dayjs(+jackpot.deadline).format('DD[D] HH[H] mm[M]') : 'JackPot isn\'t started'}</p>

      {showBetField && (
        <div className="mt-4">
          <label htmlFor={`bet-${jackpot.id}`} className="block mb-2">Enter your bet:</label>
          <input
            type="number"
            id={`bet-${jackpot.id}`}
            value={betAmount}
            onChange={handleBetChange}
            min={formatTON(jackpot.minBet)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button onClick={handleBetSubmit} className="mt-2 bg-gray-900 text-white px-4 py-2 rounded">Bet</button>
        </div>
      )}
    </div>
  );
};

export default JackpotCard;

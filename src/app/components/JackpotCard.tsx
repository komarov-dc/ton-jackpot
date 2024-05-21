// src/components/JackpotCard.tsx

import React, { useState } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Cell, beginCell, toNano } from 'ton';
dayjs.extend(relativeTime);

interface JackpotCardProps {
  jackpot: {
    address: string;
    id: string;
    isFinished: boolean;
    creator: string;
    winner: string;
    goalPrice: string;
    totalBets: string;
    minBet: string;
    nft: string;
    deadline: string;
  };
}

const JackpotCard: React.FC<JackpotCardProps> = ({ jackpot }) => {
  const [showBetField, setShowBetField] = useState(false);
  const [betAmount, setBetAmount] = useState('');

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const message = beginCell()
    .storeUint(0, 32)
    .storeBuffer(Buffer.from('bet', 'utf-8'))
    .endCell();

  const handleCardClick = () => {
    setShowBetField(true);
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetSubmit = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // valid for 60 seconds
      messages: [
        {
          address: jackpot.address,
          amount: toNano(betAmount).toString(), // amount in nanoTONs
          payload: message.toBoc().toString('base64') // serialized message
        }
      ]
    };
    const result = await tonConnectUI.sendTransaction(transaction);
  };

  const formatTON = (amount: string) => {
    const result = Number(BigInt(amount)) / 1e9;
    return result.toFixed(2);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const progressPercentage = (totalBets: string, goalPrice: string) => {
    const total = Number(BigInt(totalBets)) / 1e9;
    const goal = Number(BigInt(goalPrice)) / 1e9;
    return total >= goal ? 100 : (total / goal) * 100;
  };

  const calculateTimeLeft = (deadline: string) => {
    const deadlineDate = dayjs.unix(parseInt(deadline, 10));
    const now = dayjs();
    return deadlineDate.isAfter(now) ? deadlineDate.fromNow(true) : 'JackPot isn\'t started';
  };

  const progressBarColor = jackpot.isFinished ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-lg border border-transparent p-5 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30 cursor-pointer w-80 h-96"
    >
      <h3 className="mb-3 text-xl font-semibold">Jackpot #{jackpot.id}</h3>
      {jackpot.nft ? (
        <>
          <a href={`https://testnet.tonviewer.com/${jackpot.address}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            CA: {shortenAddress(jackpot.address)}
          </a>
          <a href={`https://testnet.tonviewer.com/${jackpot.nft}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            NFT: {jackpot.nft ? shortenAddress(jackpot.nft) : 'N/A'}
          </a>
          <a href={`https://testnet.tonviewer.com/${jackpot.creator}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            Creator: {jackpot.creator ? shortenAddress(jackpot.creator) : 'N/A'}
          </a>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Goal Price: {formatTON(jackpot.goalPrice)} TON</p>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Total Bets: {formatTON(jackpot.totalBets)} TON</p>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Minimum Bet: {formatTON(jackpot.minBet)} TON</p>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Ends in: {calculateTimeLeft(jackpot.deadline)}</p>
        </>
      ) : (
        <>
          <a href={`https://testnet.tonviewer.com/${jackpot.address}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            CA: {shortenAddress(jackpot.address)}
          </a>
          <a href={`https://testnet.tonviewer.com/${jackpot.creator}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            Creator: {jackpot.creator ? shortenAddress(jackpot.creator) : 'N/A'}
          </a>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Goal Price: {formatTON(jackpot.goalPrice)} TON</p>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Minimum Bet: {formatTON(jackpot.minBet)} TON</p>
        </>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
        <div className={`h-2.5 rounded-full ${progressBarColor}`} style={{ width: `${progressPercentage(jackpot.totalBets, jackpot.goalPrice)}%` }}></div>
      </div>
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

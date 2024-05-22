// src/components/JackpotCard.tsx

import React, { useState } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Cell, beginCell, toNano } from 'ton';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { shortenAddress } from '@/utils';

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
    nft_preview: string;
  };
}

const JackpotCard: React.FC<JackpotCardProps> = ({ jackpot }) => {
  const [betAmount, setBetAmount] = useState('');

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const message = beginCell()
    .storeUint(0, 32)
    .storeBuffer(Buffer.from('bet', 'utf-8'))
    .endCell();

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

  const progressPercentage = (totalBets: string, goalPrice: string) => {
    const total = Number(BigInt(totalBets)) / 1e9;
    const goal = Number(BigInt(goalPrice)) / 1e9;
    return total >= goal ? 100 : (total / goal) * 100;
  };

  const calculateTimeLeft = (deadline: string) => {
    const deadlineDate = dayjs.unix(parseInt(deadline, 10));
    const now = dayjs();
    return deadlineDate.isAfter(now) ? deadlineDate.fromNow(true) : 'finished';
  };

  const progressBarColor = jackpot.isFinished ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div
      className="group rounded-lg place-self-center border border-transparent p-5 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30 cursor-pointer w-80"
    >
      <h3 className="mb-3 text-xl text-teal-800 font-semibold">Lottery #{jackpot.id}</h3>
      {jackpot.nft ? (
        <>
          <img src={jackpot.nft_preview} alt='nft_image' className='w-full mb-5'></img>
          <a href={`https://testnet.tonviewer.com/${jackpot.address}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            CA: {shortenAddress(jackpot.address)}
          </a>
          <a href={`https://testnet.tonviewer.com/${jackpot.nft}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            NFT: {jackpot.nft ? shortenAddress(jackpot.nft) : 'N/A'}
          </a>
          <a href={`https://testnet.tonviewer.com/${jackpot.creator}`} target="_blank" rel="noopener noreferrer" className="block mb-2 text-sm text-blue-500">
            Creator: {jackpot.creator ? shortenAddress(jackpot.creator) : 'N/A'}
          </a>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Goal: {formatTON(jackpot.goalPrice)} TON</p>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Total bets: {formatTON(jackpot.totalBets)} TON</p>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Min. bet: {formatTON(jackpot.minBet)} TON</p>
          {
            jackpot.isFinished || dayjs.unix(parseInt(jackpot.deadline, 10)).isAfter(dayjs()) ?
            (
              <div className="ml-0 max-w-[30ch] text-sm opacity-70">FINISHED</div>
            ) :
            (
              <p className="m-0 max-w-[30ch] text-sm opacity-70">Ends in: {calculateTimeLeft(jackpot.deadline)}</p>
            )
          }
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
      {(!jackpot.isFinished && dayjs.unix(parseInt(jackpot.deadline, 10)).isAfter(dayjs())) && (<div className="mt-4">
        <label htmlFor={`bet-${jackpot.id}`} className="block mb-2">Enter your bet:</label>
        <input
          type="number"
          id={`bet-${jackpot.id}`}
          value={betAmount}
          onChange={handleBetChange}
          min={formatTON(jackpot.minBet)}
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button onClick={handleBetSubmit} className="mt-2 bg-gray-900 text-white p-2 w-full rounded">Bet</button>
      </div>)}
    </div>
  );
};

export default JackpotCard;

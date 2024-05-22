import React, { useState } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, Cell, beginCell, toNano } from 'ton';
import { JACKPOT_MASTER_CA } from '@/const';

const JackpotForm = () => {
  const [minimalBet, setMinimalBet] = useState(0.2);
  const [targetTotalBet, setTargetTotalBet] = useState(1);
  const [jackpotDuration, setJackpotDuration] = useState(60);
  const [durationUnit, setDurationUnit] = useState("hours");
  const [contractAddress, setContractAddress] = useState("");
  const [nftAddress, setNftAddress] = useState("");

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const handleCreateJackpot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    sendCreateJackPot();
  };

  const sendCreateJackPot = async () => {
    try {
      let durationInSeconds = jackpotDuration;
      if (durationUnit === "hours") {
        durationInSeconds *= 3600;
      } else if (durationUnit === "days") {
        durationInSeconds *= 86400;
      }

      const message = beginCell()
        .storeUint(0x2d98c896, 32)
        .storeUint(0, 64)
        .storeAddress(null)
        .storeCoins(toNano(targetTotalBet.toString()))
        .storeCoins(toNano(minimalBet.toString()))
        .storeUint(durationInSeconds, 32)
        .endCell();

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: JACKPOT_MASTER_CA,
            amount: toNano('0.15').toString(),
            payload: message.toBoc().toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', result);
      alert('Transaction sent successfully');
    } catch (error) {
      console.error('Failed to send transaction:', error);
      alert('Failed to send transaction');
    }
  };

  const handleStartJackpot = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting jackpot with contract address:", contractAddress, "and NFT address:", nftAddress);
    sendNftToJackPot();
  };

  const sendNftToJackPot = async () => {
    try {
      const message = beginCell()
        .storeUint(0x5fcc3d14, 32)
        .storeUint(0, 64)
        .storeAddress(Address.parse(contractAddress))
        .storeAddress(Address.parse(wallet?.account.address!))
        .storeMaybeRef(null)
        .storeCoins(toNano('0.01'))
        .storeSlice(Cell.EMPTY.beginParse())
        .endCell();

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: nftAddress,
            amount: toNano('0.1').toString(),
            payload: message.toBoc().toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', result);
      alert('Transaction sent successfully');
    } catch (error) {
      console.error('Failed to send transaction:', error);
      alert('Failed to send transaction');
    }
  };

  return (
    <div className="mt-8 mb-5 w-full max-w-5xl p-6 bg-cyan-100 rounded-lg dark:bg-gray-800">
      <h2 className="text-3xl font-semibold mb-4">Create a New Jackpot</h2>
      <form onSubmit={handleCreateJackpot} className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold">1. Create JackPot Contract</legend>
          <div className="flex flex-col">
            <label htmlFor="targetTotalBet" className="mb-2">Target Total Bet Amount:</label>
            <input
              type="number"
              id="targetTotalBet"
              className="border border-gray-300 p-2 rounded"
              value={targetTotalBet}
              onChange={(e) => setTargetTotalBet(Number(e.target.value))}
              min="1"
              step="0.1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="minimalBet" className="mb-2">Minimal Bet Amount:</label>
            <input
              type="number"
              id="minimalBet"
              className="border border-gray-300 p-2 rounded"
              value={minimalBet}
              onChange={(e) => setMinimalBet(Number(e.target.value))}
              min="0.2"
              step="0.01"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="jackpotDuration" className="mb-2">Jackpot Duration:</label>
            <input
              type="number"
              id="jackpotDuration"
              className="border border-gray-300 p-2 rounded"
              value={jackpotDuration}
              onChange={(e) => setJackpotDuration(Number(e.target.value))}
              min={durationUnit === "hours" ? 4 : 1} max={durationUnit === "hours" ? 168 : 7}
            />
            <div className="flex items-center mt-2 space-x-4">
              <label>
                <input
                  type="radio"
                  name="durationUnit"
                  value="hours"
                  checked={durationUnit === "hours"}
                  onChange={(e) => setDurationUnit(e.target.value)}
                />
                Hours
              </label>
              <label>
                <input
                  type="radio"
                  name="durationUnit"
                  value="days"
                  checked={durationUnit === "days"}
                  onChange={(e) => setDurationUnit(e.target.value)}
                />
                Days
              </label>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded">
            Create Jackpot
          </button>
        </fieldset>
      </form>
      <form onSubmit={handleStartJackpot} className="mt-8 space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold">2. Start JackPot</legend>
          <div className="flex flex-col">
            <label htmlFor="contractAddress" className="mb-2">JackPot CA:</label>
            <input
              type="text"
              id="contractAddress"
              className="border border-gray-300 p-2 rounded"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="nftAddress" className="mb-2">NFT CA:</label>
            <input
              type="text"
              id="nftAddress"
              className="border border-gray-300 p-2 rounded"
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
            />
          </div>
          <button type="submit" className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded">
            Start Jackpot
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default JackpotForm;
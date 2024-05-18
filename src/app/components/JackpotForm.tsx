// src/components/JackpotForm.tsx

import React, { useState } from 'react';

const JackpotForm = () => {
  const [minimalBet, setMinimalBet] = useState(0.2);
  const [targetTotalBet, setTargetTotalBet] = useState(1);
  const [jackpotDuration, setJackpotDuration] = useState(60);
  const [durationUnit, setDurationUnit] = useState("minutes");
  const [contractAddress, setContractAddress] = useState("");
  const [showContractAddress, setShowContractAddress] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call to fetch the contract address
    setTimeout(() => {
      const fetchedAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Example contract address
      setContractAddress(fetchedAddress);
      setShowContractAddress(true);
    }, 1000);
  };

  return (
    <div className="mt-8 w-full max-w-5xl p-6 bg-gray-100 rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Create a New Jackpot</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label htmlFor="jackpotDuration" className="mb-2">Jackpot Duration:</label>
          <input 
            type="number" 
            id="jackpotDuration" 
            className="border border-gray-300 p-2 rounded" 
            value={jackpotDuration} 
            onChange={(e) => setJackpotDuration(Number(e.target.value))} 
            min="60" 
          />
          <div className="flex items-center mt-2">
            <label className="mr-2">
              <input 
                type="radio" 
                name="durationUnit" 
                value="minutes" 
                checked={durationUnit === "minutes"} 
                onChange={(e) => setDurationUnit(e.target.value)} 
              />
              Minutes
            </label>
            <label className="mr-2">
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
        <button type="submit" className="mt-4 bg-gray-900 text-white px-4 py-2 rounded col-span-full">
          Create Jackpot
        </button>
      </form>

      {/* Contract Address Section */}
      {showContractAddress && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded col-span-full dark:bg-gray-700 dark:border-gray-600">
          <label htmlFor="contractAddress" className="block mb-2">Future Contract Address:</label>
          <input 
            type="text" 
            id="contractAddress" 
            className="border border-gray-300 p-2 rounded w-full" 
            value={contractAddress} 
            readOnly 
          />
          <button
            onClick={() => navigator.clipboard.writeText(contractAddress)}
            className="mt-2 bg-gray-900 text-white px-4 py-2 rounded"
          >
            Copy Address
          </button>
        </div>
      )}
    </div>
  );
};

export default JackpotForm;

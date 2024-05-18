// src/components/ConnectButton.tsx
"use client";

import React from 'react';
import { useTonConnectUI, useTonConnectModal, useTonWallet } from '@tonconnect/ui-react';

const ConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const wallet = useTonWallet();

  const handleConnect = () => {
    open(); // Open the wallet selection modal
  };

  return (
    <div>
      {wallet ? (
        <div>
          <span>Connected wallet: {wallet.account.address}</span>
          <span>Device: {wallet.device.appName}</span>
        </div>
      ) : (
        <button onClick={handleConnect} className="bg-gray-900 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

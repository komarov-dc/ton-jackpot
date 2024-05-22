// src/components/ConnectButton.tsx
"use client";

import React from 'react';
import { Address } from 'ton';
import { useTonConnectUI, useTonConnectModal, useTonWallet } from '@tonconnect/ui-react';
import { shortenAddress } from '@/utils';

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
        <div  className="bg-teal-600 rounded px-4 py-2">
          <span>{shortenAddress(Address.parse(wallet.account.address).toString())}</span>
        </div>
      ) : (
        <button onClick={handleConnect} className="bg-emerald-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

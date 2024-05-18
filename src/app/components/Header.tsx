// src/components/Header.tsx
import React from 'react';
import ConnectButton from './ConnectButton';

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">TON JackPot</h1>
      <ConnectButton />
    </header>
  );
};

export default Header;

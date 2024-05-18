// src/app/components/Search.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div className="flex flex-col items-center lg:items-start">
      <form onSubmit={handleSearch} className="flex items-center mb-2">
        <label htmlFor="search" className="mr-2">Search:</label>
        <input 
          type="text" 
          id="search" 
          className="border border-gray-300 p-2 rounded" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button type="submit" className="ml-2 bg-gray-900 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;

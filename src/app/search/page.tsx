// src/app/search/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call to fetch search results
    if (query) {
      setSearchResults([
        "Search Result 1",
        "Search Result 2",
        "Search Result 3",
      ]);
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="p-24 flex-grow">
        <h1 className="text-2xl font-semibold mb-4">Search Results for: {query}</h1>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index} className="py-2 border-b last:border-0">
                {result}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;

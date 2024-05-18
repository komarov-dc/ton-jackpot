"use client";

import Header from './components/Header';
import Search from './components/Search';
import JackpotGrid from './components/JackpotGrid';
import JackpotForm from './components/JackpotForm';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header />
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-between font-mono text-sm lg:flex lg:items-start">
        {/* Search and Title */}
        <div className="mt-16 w-full flex flex-col items-center lg:flex-row lg:justify-between">
          <h2 className="text-2xl font-semibold mb-4 lg:mb-0">Current JackPots:</h2>
          <Search />
        </div>

        {/* Grid */}
        <JackpotGrid />

        {/* Load More Button */}
        <button className="mt-8 bg-gray-900 text-white px-4 py-2 rounded">Load more</button>
      </div>

      {/* Form Section */}
      <JackpotForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}

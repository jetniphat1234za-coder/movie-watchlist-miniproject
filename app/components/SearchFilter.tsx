'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchFilter() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="🔍 Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 transition"
          />
        </div>
        <button
          type="submit"
          className="rounded-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition shadow-sm shadow-indigo-500/20"
        >
          Search
        </button>
      </form>
      
      <p className="text-sm text-white/50">
        💡 Tip: Search by movie name, or go to your <Link href="/my-list" className="text-indigo-300 hover:text-indigo-200 underline">Watchlist</Link> to filter saved movies
      </p>
    </div>
  );
}

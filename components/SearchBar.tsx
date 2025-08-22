'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search destinations, cities, monuments...",
  className = '',
  isLoading = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions] = useState([
    'Paris, France',
    'Tokyo, Japan',
    'Machu Picchu, Peru',
    'Great Wall of China',
    'Rome, Italy',
    'Santorini, Greece'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white shadow-sm"
          />
        </div>
      </form>

      {query === '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Destinations</h4>
            <div className="space-y-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
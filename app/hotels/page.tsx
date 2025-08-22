'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Filter, Building, Wifi, Car, Coffee } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    // Simulate search
    setTimeout(() => setLoading(false), 1000);
  };

  const hotelAreas = [
    {
      id: '1',
      name: 'City Center',
      description: 'Close to main attractions and business district',
      priceRange: '$$$',
      features: ['Public Transport', 'Restaurants', 'Shopping']
    },
    {
      id: '2',
      name: 'Historic District',
      description: 'Traditional architecture and cultural sites',
      priceRange: '$$',
      features: ['Museums', 'Historic Sites', 'Walking Tours']
    },
    {
      id: '3',
      name: 'Waterfront',
      description: 'Scenic views and recreational activities',
      priceRange: '$$$$',
      features: ['Ocean View', 'Beach Access', 'Water Sports']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Hotels</h1>
              <p className="text-gray-600 mt-1">Discover the best areas to stay in your destination</p>
            </div>
            
            <div className="flex-1 max-w-xl">
              <SearchBar
                onSearch={handleSearch}
                isLoading={loading}
                placeholder="Search by city or destination..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Budget', 'Mid-range', 'Luxury', 'Business', 'Family'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Areas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Areas to Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelAreas.map((area) => (
              <div key={area.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{area.name}</h3>
                    <p className="text-gray-600 text-sm">{area.description}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">{area.priceRange}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {area.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-gray-500 text-sm">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        <span>Hotels</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Central</span>
                      </div>
                    </div>
                    <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                      View Hotels
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Booking Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Book Your Stay</h3>
          <p className="text-gray-600 mb-6">Compare prices and book directly with these trusted partners:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Booking.com', url: 'https://booking.com' },
              { name: 'Hotels.com', url: 'https://hotels.com' },
              { name: 'Expedia', url: 'https://expedia.com' },
              { name: 'Agoda', url: 'https://agoda.com' }
            ].map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{site.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
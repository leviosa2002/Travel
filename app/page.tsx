'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Compass, Calendar, Star, TrendingUp, Globe } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import Map from '@/components/Map';
import PlaceCard from '@/components/PlaceCard';
import { wikipediaAPI } from '@/lib/wiki';
import { Place } from '@/types/place';

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Featured destinations data
  const featuredPlaces: Place[] = [
    {
      id: '1',
      title: 'Paris',
      extract: 'The City of Light, capital of France, known for its art, fashion, and romance.',
      pageId: 22989,
      type: 'city',
      country: 'France',
      coordinates: { lat: 48.8566, lon: 2.3522 },
      thumbnail: {
        source: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500',
        width: 500,
        height: 300
      }
    },
    {
      id: '2',
      title: 'Tokyo',
      extract: 'Modern metropolis blending traditional Japanese culture with cutting-edge technology.',
      pageId: 32070,
      type: 'city',
      country: 'Japan',
      coordinates: { lat: 35.6762, lon: 139.6503 },
      thumbnail: {
        source: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
        width: 500,
        height: 300
      }
    },
    {
      id: '3',
      title: 'Machu Picchu',
      extract: 'Ancient Incan citadel set high in the Andes Mountains of Peru.',
      pageId: 18804,
      type: 'monument',
      country: 'Peru',
      coordinates: { lat: -13.1631, lon: -72.5450 },
      thumbnail: {
        source: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500',
        width: 500,
        height: 300
      }
    },
    {
      id: '4',
      title: 'Great Wall of China',
      extract: 'Historic fortification stretching across northern China, a UNESCO World Heritage Site.',
      pageId: 5094,
      type: 'monument',
      country: 'China',
      coordinates: { lat: 40.4319, lon: 116.5704 },
      thumbnail: {
        source: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500',
        width: 500,
        height: 300
      }
    },
    {
      id: '5',
      title: 'Rome',
      extract: 'The Eternal City with over 2,500 years of history and countless ancient landmarks.',
      pageId: 25458,
      type: 'city',
      country: 'Italy',
      coordinates: { lat: 41.9028, lon: 12.4964 },
      thumbnail: {
        source: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500',
        width: 500,
        height: 300
      }
    },
    {
      id: '6',
      title: 'Santorini',
      extract: 'Beautiful Greek island famous for its white-washed buildings and stunning sunsets.',
      pageId: 26825,
      type: 'city',
      country: 'Greece',
      coordinates: { lat: 36.3932, lon: 25.4615 },
      thumbnail: {
        source: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500',
        width: 500,
        height: 300
      }
    }
  ];

  const mapMarkers = featuredPlaces.map(place => ({
    id: place.id,
    position: [place.coordinates?.lat || 0, place.coordinates?.lon || 0] as [number, number],
    title: place.title,
    description: place.extract.substring(0, 100) + '...',
    onClick: () => handlePlaceClick(place)
  }));

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Navigate to explore page with search query
      router.push(`/explore?search=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlaceClick = (place: Place) => {
    const slug = place.title.toLowerCase().replace(/\s+/g, '-');
    if (place.type === 'city') {
      router.push(`/city/${slug}`);
    } else if (place.type === 'monument') {
      router.push(`/monument/${slug}`);
    } else {
      router.push(`/place/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              <span>Explore the world for free</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Travel Guide
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover amazing destinations, plan your perfect itinerary, and explore the world with comprehensive travel information at your fingertips.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar
              onSearch={handleSearch}
              isLoading={isSearching}
              placeholder="Where do you want to go? Search cities, countries, monuments..."
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => router.push('/explore')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Map</span>
            </button>
            <button
              onClick={() => router.push('/itinerary')}
              className="flex items-center space-x-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Plan Your Trip</span>
            </button>
          </div>
        </div>
      </section>

      {/* World Map Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Trending Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any marker to learn more about these popular travel destinations around the world.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Map
              center={[30, 0]}
              zoom={2}
              markers={mapMarkers}
              height="500px"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Places */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start your journey with these handpicked destinations that offer incredible experiences and rich cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => handlePlaceClick(place)}
                showAddToItinerary={true}
                onAddToItinerary={() => {
                  // Add to itinerary logic
                  console.log('Add to itinerary:', place.title);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need for Perfect Travel Planning
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              All the tools and information you need to plan and enjoy your perfect trip, completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
                <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Interactive Maps</h3>
                <p className="text-blue-100">
                  Explore destinations with detailed interactive maps and location information.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
                <Calendar className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Trip Planning</h3>
                <p className="text-blue-100">
                  Create custom itineraries and organize your perfect travel schedule.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
                <Star className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Reviews & Ratings</h3>
                <p className="text-blue-100">
                  Read authentic reviews and ratings from fellow travelers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers who trust our platform for their journey planning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => router.push('/explore')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Compass className="w-5 h-5" />
              <span>Start Exploring</span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Star className="w-5 h-5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, MapPin, Globe, Mountain, Building, Star } from 'lucide-react';
import Map from '@/components/Map';
import PlaceCard from '@/components/PlaceCard';
import SearchBar from '@/components/SearchBar';
import { Place } from '@/types/place';
import { wikipediaAPI } from '@/lib/wiki';
import { geocodingAPI } from '@/lib/geocoding';

export default function ExplorePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    continent: 'all',
    difficulty: 'all'
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search');

  const continents = [
    { id: 'all', name: 'All Continents' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia', name: 'Asia' },
    { id: 'americas', name: 'Americas' },
    { id: 'africa', name: 'Africa' },
    { id: 'oceania', name: 'Oceania' }
  ];

  const placeTypes = [
    { id: 'all', name: 'All Types', icon: Globe },
    { id: 'city', name: 'Cities', icon: Building },
    { id: 'monument', name: 'Monuments', icon: Mountain },
    { id: 'attraction', name: 'Attractions', icon: Star }
  ];

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
      handleSearch(initialSearch);
    } else {
      loadFeaturedPlaces();
    }
  }, [initialSearch]);

  useEffect(() => {
    applyFilters();
  }, [places, selectedFilters]);

  const loadFeaturedPlaces = async () => {
    setLoading(true);
    try {
      // Load a curated list of popular destinations
      const featuredQueries = [
        'Paris', 'Tokyo', 'New York', 'London', 'Rome', 'Barcelona',
        'Dubai', 'Sydney', 'Bangkok', 'Amsterdam', 'Istanbul', 'Prague',
        'Machu Picchu', 'Great Wall of China', 'Taj Mahal', 'Petra',
        'Colosseum', 'Eiffel Tower'
      ];

      const searchPromises = featuredQueries.map(async (query) => {
        const results = await wikipediaAPI.searchPlaces(query, 1);
        return results[0];
      });

      const results = await Promise.all(searchPromises);
      const validPlaces = results.filter(Boolean).map((place, index) => ({
        ...place,
        type: index < 12 ? 'city' : 'monument',
        coordinates: getRandomCoordinates()
      })) as Place[];

      setPlaces(validPlaces);
    } catch (error) {
      console.error('Error loading featured places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    
    try {
      const searchResults = await wikipediaAPI.searchPlaces(query, 20);
      const placesWithCoords = await Promise.all(
        searchResults.map(async (place) => {
          const coords = await geocodingAPI.geocodePlace(place.title);
          return {
            ...place,
            type: determinePlaceType(place.title, place.extract),
            coordinates: coords ? { lat: coords.lat, lon: coords.lon } : getRandomCoordinates()
          } as Place;
        })
      );

      setPlaces(placesWithCoords);
      
      // Center map on first result if available
      if (placesWithCoords[0]?.coordinates) {
        setMapCenter([placesWithCoords[0].coordinates.lat, placesWithCoords[0].coordinates.lon]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = places;

    if (selectedFilters.type !== 'all') {
      filtered = filtered.filter(place => place.type === selectedFilters.type);
    }

    setFilteredPlaces(filtered);
  };

  const determinePlaceType = (title: string, extract: string): Place['type'] => {
    const cityKeywords = ['city', 'capital', 'metropolitan', 'urban'];
    const monumentKeywords = ['monument', 'temple', 'palace', 'castle', 'tower', 'wall', 'cathedral'];
    
    const text = (title + ' ' + extract).toLowerCase();
    
    if (monumentKeywords.some(keyword => text.includes(keyword))) {
      return 'monument';
    }
    if (cityKeywords.some(keyword => text.includes(keyword))) {
      return 'city';
    }
    return 'attraction';
  };

  const getRandomCoordinates = () => ({
    lat: (Math.random() - 0.5) * 160, // -80 to 80
    lon: (Math.random() - 0.5) * 360  // -180 to 180
  });

  const mapMarkers = filteredPlaces
    .filter(place => place.coordinates)
    .map(place => ({
      id: place.id,
      position: [place.coordinates!.lat, place.coordinates!.lon] as [number, number],
      title: place.title,
      description: place.extract.substring(0, 100) + '...',
      onClick: () => handlePlaceClick(place)
    }));

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

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Destinations</h1>
              <p className="text-gray-600 mt-1">
                Discover amazing places around the world
                {searchQuery && ` • Results for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex-1 max-w-xl">
              <SearchBar
                onSearch={handleSearch}
                isLoading={loading}
                placeholder="Search destinations..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full xl:w-80 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Type</h4>
                <div className="space-y-2">
                  {placeTypes.map((type) => (
                    <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type.id}
                        checked={selectedFilters.type === type.id}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{type.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Results</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Places</span>
                    <span className="font-medium">{filteredPlaces.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cities</span>
                    <span className="font-medium">
                      {filteredPlaces.filter(p => p.type === 'city').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monuments</span>
                    <span className="font-medium">
                      {filteredPlaces.filter(p => p.type === 'monument').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Interactive Map</span>
                </h3>
              </div>
              <Map
                center={mapCenter}
                zoom={2}
                markers={mapMarkers}
                height="400px"
              />
            </div>

            {/* Results Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {filteredPlaces.length} Destinations Found
                </h3>
                <div className="text-sm text-gray-500">
                  {loading && 'Loading...'}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onClick={() => handlePlaceClick(place)}
                      showAddToItinerary={true}
                      onAddToItinerary={() => {
                        console.log('Add to itinerary:', place.title);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or explore featured destinations.
                  </p>
                  <button
                    onClick={loadFeaturedPlaces}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Show Featured Places
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
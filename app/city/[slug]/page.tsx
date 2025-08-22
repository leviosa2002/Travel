'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Users, Clock, Calendar, Plane, Building, Star, Camera } from 'lucide-react';
import Map from '@/components/Map';
import WeatherWidget from '@/components/WeatherWidget';
import PlaceCard from '@/components/PlaceCard';
import { PlaceDetail, Place } from '@/types/place';
import { Country } from '@/types/country';
import { wikipediaAPI } from '@/lib/wiki';
import { geocodingAPI } from '@/lib/geocoding';
import { countriesAPI } from '@/lib/countries';
import { unsplashAPI } from '@/lib/unsplash';

export default function CityPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [city, setCity] = useState<PlaceDetail | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [attractions, setAttractions] = useState<Place[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (slug) {
      loadCityData();
    }
  }, [slug]);

  const loadCityData = async () => {
    setLoading(true);
    try {
      const cityName = slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      // Load city details
      const cityData = await wikipediaAPI.getPlaceDetails(cityName);
      if (cityData) {
        setCity({
          ...cityData,
          fullText: cityData.extract,
          sections: [],
          type: 'city'
        });

        // Get coordinates
        let coords = cityData.coordinates;
        if (!coords) {
          const geocoded = await geocodingAPI.geocodePlace(cityName);
          if (geocoded) {
            coords = { lat: geocoded.lat, lon: geocoded.lon };
          }
        }
        setCoordinates(coords);

        // Load country data
        const geocoded = await geocodingAPI.geocodePlace(cityName);
        if (geocoded?.countryCode) {
          const countryData = await countriesAPI.getCountryByCode(geocoded.countryCode);
          setCountry(countryData);
        }

        // Load attractions
        const attractionQueries = [
          `${cityName} attractions`,
          `${cityName} monuments`,
          `${cityName} museums`,
          `${cityName} landmarks`
        ];

        const attractionResults = await Promise.all(
          attractionQueries.map(query => wikipediaAPI.searchPlaces(query, 3))
        );

        const allAttractions = attractionResults.flat()
          .filter((attraction, index, self) => 
            index === self.findIndex(a => a.title === attraction.title)
          )
          .slice(0, 6)
          .map(attraction => ({
            ...attraction,
            type: 'attraction' as const,
            country: country?.name.common
          }));

        setAttractions(allAttractions);

        // Load images
        const imageUrls = await unsplashAPI.searchPhotos(`${cityName} city`, 12);
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error loading city data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-6">The city you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/explore')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Explore Other Cities
          </button>
        </div>
      </div>
    );
  }

  const mapMarker = coordinates ? [{
    id: city.id,
    position: [coordinates.lat, coordinates.lon] as [number, number],
    title: city.title,
    description: city.extract
  }] : [];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building },
    { id: 'attractions', name: 'Attractions', icon: Star },
    { id: 'photos', name: 'Photos', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {images[0] && (
          <>
            <img
              src={images[0]}
              alt={city.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </>
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 pb-8 w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  {country?.flag && (
                    <span className="text-4xl">{country.flag}</span>
                  )}
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                      {city.title}
                    </h1>
                    <div className="flex items-center text-white/90 text-lg">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{country?.name.common || 'Unknown Country'}</span>
                    </div>
                  </div>
                </div>
                
                {country && (
                  <div className="flex items-center space-x-6 text-white/80 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{(country.population / 1000000).toFixed(1)}M people</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{country.timezones?.[0] || 'UTC'}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                  Save City
                </button>
                <button
                  onClick={() => router.push('/itinerary')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Plan Trip Here
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* City Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About {city.title}</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {city.extract}
                    </p>
                  </div>
                </div>

                {/* City Statistics */}
                {country && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">City Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {(country.population / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-500">Population</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {country.area.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Area (km²)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Object.keys(country.currencies || {}).length}
                        </div>
                        <div className="text-sm text-gray-500">Currencies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Object.keys(country.languages || {}).length}
                        </div>
                        <div className="text-sm text-gray-500">Languages</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Map */}
                {coordinates && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                    <Map
                      center={[coordinates.lat, coordinates.lon]}
                      zoom={11}
                      markers={mapMarker}
                      height="400px"
                      className="rounded-lg overflow-hidden"
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attractions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Top Attractions in {city.title}
                  </h3>
                  {attractions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {attractions.map((attraction) => (
                        <PlaceCard
                          key={attraction.id}
                          place={attraction}
                          onClick={() => {
                            const slug = attraction.title.toLowerCase().replace(/\s+/g, '-');
                            router.push(`/place/${slug}`);
                          }}
                          showAddToItinerary={true}
                          onAddToItinerary={() => {
                            console.log('Add to itinerary:', attraction.title);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No attractions found. Check back later for updates.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Photos of {city.title}
                  </h3>
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={image}
                            alt={`${city.title} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No photos available.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            {coordinates && (
              <WeatherWidget
                lat={coordinates.lat}
                lon={coordinates.lon}
              />
            )}

            {/* Country Information */}
            {country && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About {country.name.common}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Capital</span>
                    <span className="font-medium">{country.capital?.[0] || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Region</span>
                    <span className="font-medium">{country.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium">
                      {Object.values(country.currencies || {})[0]?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">
                      {Object.values(country.languages || {})[0] || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Travel Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Tips</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Plane className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Getting There</h4>
                    <p className="text-sm text-gray-600">
                      Check for international flights to major airports in {city.title}.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Best Time to Visit</h4>
                    <p className="text-sm text-gray-600">
                      Spring and fall typically offer pleasant weather for exploring.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Accommodation</h4>
                    <p className="text-sm text-gray-600">
                      City center and historic districts offer convenient locations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Your Visit</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/itinerary')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Itinerary
                </button>
                
                <button
                  onClick={() => router.push('/hotels')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Find Hotels
                </button>
                
                <button
                  onClick={() => router.push(`/reviews/${city.id}`)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Read Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
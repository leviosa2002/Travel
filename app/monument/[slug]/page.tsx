'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Star, Calendar, Share2, Heart, Camera, Info } from 'lucide-react';
import Map from '@/components/Map';
import WeatherWidget from '@/components/WeatherWidget';
import { PlaceDetail } from '@/types/place';
import { wikipediaAPI } from '@/lib/wiki';
import { geocodingAPI } from '@/lib/geocoding';
import { unsplashAPI } from '@/lib/unsplash';

export default function MonumentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [monument, setMonument] = useState<PlaceDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (slug) {
      loadMonumentData();
    }
  }, [slug]);

  const loadMonumentData = async () => {
    setLoading(true);
    try {
      // Convert slug back to title
      const title = slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      // Load monument details
      const monumentData = await wikipediaAPI.getPlaceDetails(title);
      if (monumentData) {
        setMonument({
          ...monumentData,
          fullText: monumentData.extract,
          sections: [],
          type: 'monument'
        });

        // Load coordinates if not available
        let coords = monumentData.coordinates;
        if (!coords) {
          const geocoded = await geocodingAPI.geocodePlace(title);
          if (geocoded) {
            coords = { lat: geocoded.lat, lon: geocoded.lon };
          }
        }
        setCoordinates(coords);

        // Load images
        const imageUrls = await unsplashAPI.searchPhotos(title, 8);
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error loading monument data:', error);
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
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!monument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Monument Not Found</h1>
          <p className="text-gray-600 mb-6">The monument you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/explore')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Explore Other Monuments
          </button>
        </div>
      </div>
    );
  }

  const mapMarker = coordinates ? [{
    id: monument.id,
    position: [coordinates.lat, coordinates.lon] as [number, number],
    title: monument.title,
    description: monument.extract
  }] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Gallery */}
      <section className="relative h-96 overflow-hidden">
        {images.length > 0 && (
          <>
            <img
              src={images[activeImageIndex]}
              alt={monument.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-6xl mx-auto px-4 pb-8 w-full">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                      {monument.title}
                    </h1>
                    {coordinates && (
                      <div className="flex items-center text-white/90 text-lg">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => router.push('/itinerary')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.slice(0, 6).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">4.{Math.floor(Math.random() * 5) + 3}</span>
                    <span className="text-gray-500 text-sm">({Math.floor(Math.random() * 1000) + 500} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">2-4 hours recommended</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Camera className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Photo Spots</div>
                  <div className="text-xs text-gray-500">Many available</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Info className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Best Time</div>
                  <div className="text-xs text-gray-500">Year-round</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Crowds</div>
                  <div className="text-xs text-gray-500">Moderate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Accessibility</div>
                  <div className="text-xs text-gray-500">Good</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {monument.title}</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {monument.extract}
                </p>
              </div>
            </div>

            {/* Location Map */}
            {coordinates && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <Map
                  center={[coordinates.lat, coordinates.lon]}
                  zoom={13}
                  markers={mapMarker}
                  height="300px"
                  className="rounded-lg overflow-hidden"
                />
                <div className="mt-4 text-sm text-gray-600">
                  <p>Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lon.toFixed(6)}</p>
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

            {/* Visit Planning */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Your Visit</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Historical Significance</h4>
                  <p className="text-sm text-gray-600">
                    This monument represents an important part of cultural and historical heritage.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recommended Duration</h4>
                  <p className="text-sm text-gray-600">
                    Plan to spend 2-4 hours exploring this monument thoroughly.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Getting There</h4>
                  <p className="text-sm text-gray-600">
                    Check local transportation options and accessibility information before your visit.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push('/itinerary')}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
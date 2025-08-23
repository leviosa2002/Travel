'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/types/place';
import { MapPin, Star, Clock, Calendar } from 'lucide-react';
import { unsplashAPI } from '@/lib/unsplash';
import LoadingSpinner from './LoadingSpinner';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  showAddToItinerary?: boolean;
  onAddToItinerary?: () => void;
  className?: string;
}

export default function PlaceCard({ 
  place, 
  onClick, 
  showAddToItinerary = false,
  onAddToItinerary,
  className = ''
}: PlaceCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const getPlaceImage = () => {
    if (place.thumbnail?.source) {
      return place.thumbnail.source;
    }
    return unsplashAPI.getRandomPlaceholderImage();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getPlaceTypeColor = (type: string) => {
    const colors = {
      city: 'bg-blue-100 text-blue-800',
      monument: 'bg-purple-100 text-purple-800',
      attraction: 'bg-green-100 text-green-800',
      country: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCardClick = async () => {
    if (onClick && !isNavigating) {
      setIsNavigating(true);
      try {
        await onClick();
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const handleAddToItinerary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToItinerary) {
      try {
        await onAddToItinerary();
        // You could add a toast notification here
        console.log(`Added ${place.title} to itinerary`);
      } catch (error) {
        console.error('Error adding to itinerary:', error);
      }
    }
  };
  return (
    <div className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${isNavigating ? 'opacity-75' : ''} ${className}`}>
      <div className="relative h-48 overflow-hidden" onClick={handleCardClick}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
        {isNavigating && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <LoadingSpinner size="md" text="Loading..." />
          </div>
        )}
        <img
          src={getPlaceImage()}
          alt={place.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlaceTypeColor(place.type)}`}>
            {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {place.title}
          </h3>
          {place.country && (
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{place.country}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {truncateText(place.extract, 120)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>4.{Math.floor(Math.random() * 5) + 3}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>2-3 hours</span>
            </div>
          </div>

          {showAddToItinerary && (
            <button
              onClick={handleAddToItinerary}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-3 h-3" />
              <span>Add to Trip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
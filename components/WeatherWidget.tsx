'use client';

import { useEffect, useState } from 'react';
import { WeatherData } from '@/types/weather';
import { weatherAPI } from '@/lib/weather';
import { APIError } from '@/lib/api';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface WeatherWidgetProps {
  lat: number;
  lon: number;
  className?: string;
}

export default function WeatherWidget({ lat, lon, className = '' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherAPI.getCurrentWeather(lat, lon);
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError('Failed to load weather data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg animate-pulse ${className}`}>
        <LoadingSpinner text="Loading weather..." />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">Weather data unavailable</p>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    );
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (code <= 3) return <Cloud className="w-12 h-12 text-gray-500" />;
    if (code >= 61 && code <= 65) return <CloudRain className="w-12 h-12 text-blue-500" />;
    return <Cloud className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Weather</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {getWeatherIcon(weather.current.weatherCode)}
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {weather.current.temperature}°C
            </div>
            <div className="text-sm text-gray-600">
              {weatherAPI.getWeatherDescription(weather.current.weatherCode)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {weather.current.windSpeed} km/h
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {weather.current.humidity}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {Math.round(weather.current.pressure)} hPa
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {Math.round(weather.current.visibility / 1000)} km
          </span>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">7-Day Forecast</h4>
        <div className="space-y-2">
          {weather.daily.slice(0, 5).map((day, index) => (
            <div key={day.date} className="flex items-center justify-between text-sm">
              <span className="text-gray-600 w-20">
                {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </span>
              <span className="text-gray-600 flex-1 text-center">
                {weatherAPI.getWeatherIcon(day.weatherCode)}
              </span>
              <span className="text-gray-800 font-medium w-20 text-right">
                {day.temperatureMax}° / {day.temperatureMin}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, Trash2, Edit3 } from 'lucide-react';

export default function ItineraryPage() {
  const [itineraries, setItineraries] = useState([
    {
      id: '1',
      title: 'Paris Adventure',
      destination: 'Paris, France',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      days: 5
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Itineraries</h1>
          <p className="text-gray-600">Plan and organize your perfect trips</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Itinerary Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Itinerary</h3>
              <p className="text-gray-500 text-sm">Start planning your next adventure</p>
            </div>
          </div>

          {/* Existing Itineraries */}
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{itinerary.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{itinerary.destination}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{itinerary.startDate} - {itinerary.endDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{itinerary.days} days</span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
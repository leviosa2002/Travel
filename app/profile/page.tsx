'use client';

import { useState } from 'react';
import { User, MapPin, Calendar, Star, Settings, Heart, Camera, Plane } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'itineraries', name: 'My Trips', icon: Calendar },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const mockUser = {
    name: 'Travel Explorer',
    email: 'explorer@example.com',
    joinDate: '2024-01-15',
    tripsCount: 5,
    reviewsCount: 12,
    favoritesCount: 28
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockUser.name}</h1>
              <p className="text-gray-600 mb-4">{mockUser.email}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {mockUser.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-1" />
                  <span>{mockUser.tripsCount} trips</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{mockUser.reviewsCount} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Travel Stats</h3>
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Trips</span>
                    <span className="font-medium">{mockUser.tripsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries Visited</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cities Explored</span>
                    <span className="font-medium">23</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews Written</span>
                    <span className="font-medium">{mockUser.reviewsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Places Favorited</span>
                    <span className="font-medium">{mockUser.favoritesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Helpful Votes</span>
                    <span className="font-medium">45</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Preferences</h3>
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Style</span>
                    <span className="font-medium">Adventure</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget Range</span>
                    <span className="font-medium">Mid-range</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notifications</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itineraries' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">My Itineraries</h3>
              <p className="text-gray-600">Your saved trip plans will appear here.</p>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Favorite Places</h3>
              <p className="text-gray-600">Places you've saved for future visits will appear here.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">My Reviews</h3>
              <p className="text-gray-600">Reviews you've written will appear here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue={mockUser.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={mockUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
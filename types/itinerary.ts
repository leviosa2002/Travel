export interface ItineraryItem {
  id: string;
  placeId: string;
  title: string;
  description?: string;
  duration: number; // in hours
  startTime?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  notes?: string;
  images?: string[];
}

export interface ItineraryDay {
  id: string;
  date: string;
  items: ItineraryItem[];
  notes?: string;
}

export interface Itinerary {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  likes?: number;
}

export interface ItineraryTemplate {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  destination: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  highlights: string[];
  estimatedCost?: {
    min: number;
    max: number;
    currency: string;
  };
}
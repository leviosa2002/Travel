export interface Place {
  id: string;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  coordinates?: {
    lat: number;
    lon: number;
  };
  pageId: number;
  country?: string;
  continent?: string;
  type: 'city' | 'monument' | 'attraction' | 'country';
  images?: string[];
  categories?: string[];
}

export interface PlaceDetail extends Place {
  fullText: string;
  sections: {
    title: string;
    content: string;
  }[];
  infobox?: Record<string, string>;
  references?: string[];
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  images?: string[];
}

export interface SearchResult {
  places: Place[];
  total: number;
  suggestion?: string;
}
import { APIError, fetchWithRetry, config } from './api';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    download: string;
  };
}

export class UnsplashAPI {
  private baseUrl = config.apis.unsplash;
  private accessKey = config.keys.unsplash;

  // Fallback to curated public domain images when no API key
  private fallbackImages = [
    'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800', // Paris
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', // Tokyo
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', // Mountains
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // Beach
    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800', // City
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', // Lake
  ];

  async searchPhotos(query: string, perPage = 6): Promise<string[]> {
    // If no API key, return fallback images
    if (!this.accessKey) {
      return this.fallbackImages.slice(0, perPage);
    }

    try {
      const params = new URLSearchParams({
        query: `${query} travel destination`,
        per_page: perPage.toString(),
        orientation: 'landscape'
      });

      const response = await fetchWithRetry(`${this.baseUrl}/search/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      });

      const data = await response.json();
      
      if (data.errors) {
        throw new APIError(`Unsplash API error: ${data.errors.join(', ')}`);
      }
      
      return data.results?.map((photo: UnsplashPhoto) => photo.urls.regular) || this.fallbackImages.slice(0, perPage);
    } catch (error) {
      console.error('Unsplash search error:', error);
      if (error instanceof APIError && this.accessKey) {
        // If we have an API key but still got an error, log it
        console.warn('Unsplash API failed, falling back to default images');
      }
      return this.fallbackImages.slice(0, perPage);
    }
  }

  async getPhotosByCollection(collectionId: string, perPage = 12): Promise<string[]> {
    if (!this.accessKey) {
      return this.fallbackImages;
    }

    try {
      const params = new URLSearchParams({
        per_page: perPage.toString()
      });

      const response = await fetchWithRetry(`${this.baseUrl}/collections/${collectionId}/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      });

      const data: UnsplashPhoto[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from Unsplash collections API');
      }
      
      return data.map(photo => photo.urls.regular);
    } catch (error) {
      console.error('Unsplash collection error:', error);
      return this.fallbackImages;
    }
  }

  getRandomPlaceholderImage(width = 800, height = 600): string {
    const randomIndex = Math.floor(Math.random() * this.fallbackImages.length);
    return this.fallbackImages[randomIndex];
  }

  // Get trending photos for homepage
  async getTrendingPhotos(count = 6): Promise<string[]> {
    if (!this.accessKey) {
      return this.fallbackImages.slice(0, count);
    }
}

    try {
      const response = await fetchWithRetry(`${this.baseUrl}/photos?per_page=${count}&order_by=popular`, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
      const data: UnsplashPhoto[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from Unsplash trending API');
      }
      
      return data.map(photo => photo.urls.regular);
    } catch (error) {
      console.error('Unsplash trending error:', error);
      return this.fallbackImages.slice(0, count);
    }
  }
        }
      });
export const unsplashAPI = new UnsplashAPI();
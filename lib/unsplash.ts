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
  private baseUrl = 'https://api.unsplash.com';
  private accessKey = process.env.UNSPLASH_ACCESS_KEY;

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

      const response = await fetch(`${this.baseUrl}/search/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      });

      const data = await response.json();
      return data.results?.map((photo: UnsplashPhoto) => photo.urls.regular) || this.fallbackImages.slice(0, perPage);
    } catch (error) {
      console.error('Unsplash search error:', error);
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

      const response = await fetch(`${this.baseUrl}/collections/${collectionId}/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      });

      const data: UnsplashPhoto[] = await response.json();
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
}

export const unsplashAPI = new UnsplashAPI();
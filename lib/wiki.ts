interface WikipediaSearchResult {
  query: {
    search: Array<{
      title: string;
      pageid: number;
      extract: string;
    }>;
  };
}

interface WikipediaPageResult {
  query: {
    pages: Record<string, {
      pageid: number;
      title: string;
      extract: string;
      thumbnail?: {
        source: string;
        width: number;
        height: number;
      };
      coordinates?: Array<{
        lat: number;
        lon: number;
      }>;
      categories?: Array<{
        title: string;
      }>;
    }>;
  };
}

export class WikipediaAPI {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private apiUrl = 'https://en.wikipedia.org/w/api.php';

  async searchPlaces(query: string, limit = 10) {
    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: `${query} geography OR city OR country OR monument OR attraction`,
        format: 'json',
        origin: '*',
        srlimit: limit.toString(),
        srprop: 'extracts'
      });

      const response = await fetch(`${this.apiUrl}?${params}`);
      const data: WikipediaSearchResult = await response.json();
      
      return data.query.search.map(item => ({
        id: item.pageid.toString(),
        title: item.title,
        extract: item.extract,
        pageId: item.pageid
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  async getPlaceDetails(title: string) {
    try {
      const params = new URLSearchParams({
        action: 'query',
        titles: title,
        format: 'json',
        origin: '*',
        prop: 'extracts|pageimages|coordinates|categories',
        exintro: 'true',
        explaintext: 'true',
        piprop: 'thumbnail|original',
        pithumbsize: '500',
        colimit: '10'
      });

      const response = await fetch(`${this.apiUrl}?${params}`);
      const data: WikipediaPageResult = await response.json();
      
      const pages = Object.values(data.query.pages);
      if (pages.length === 0) return null;

      const page = pages[0];
      return {
        id: page.pageid.toString(),
        title: page.title,
        extract: page.extract,
        thumbnail: page.thumbnail,
        coordinates: page.coordinates?.[0],
        pageId: page.pageid,
        categories: page.categories?.map(cat => cat.title.replace('Category:', ''))
      };
    } catch (error) {
      console.error('Wikipedia page details error:', error);
      return null;
    }
  }

  async getPlaceContent(title: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/page/summary/${encodeURIComponent(title)}`
      );
      const data = await response.json();
      
      return {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail,
        coordinates: data.coordinates,
        pageId: data.pageid
      };
    } catch (error) {
      console.error('Wikipedia content error:', error);
      return null;
    }
  }

  async getFeaturedPlaces() {
    try {
      // Get featured articles from Wikipedia
      const response = await fetch(
        `${this.baseUrl}/page/featured/2024/01/01`
      );
      const data = await response.json();
      
      return data.slice(0, 6).map((item: any) => ({
        id: item.pageid?.toString() || Math.random().toString(),
        title: item.title,
        extract: item.extract,
        thumbnail: item.thumbnail
      }));
    } catch (error) {
      console.error('Wikipedia featured places error:', error);
      // Fallback to curated list
      return [
        { id: '1', title: 'Paris', extract: 'The City of Light, capital of France' },
        { id: '2', title: 'Tokyo', extract: 'Modern metropolis blending tradition and innovation' },
        { id: '3', title: 'Machu Picchu', extract: 'Ancient Incan citadel in Peru' },
        { id: '4', title: 'Great Wall of China', extract: 'Historic fortification across northern China' },
        { id: '5', title: 'Rome', extract: 'The Eternal City with ancient history' },
        { id: '6', title: 'Santorini', extract: 'Beautiful Greek island with white-washed buildings' }
      ];
    }
  }
}

export const wikipediaAPI = new WikipediaAPI();
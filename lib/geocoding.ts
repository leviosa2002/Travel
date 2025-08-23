import { APIError, fetchWithRetry, config } from './api';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    country?: string;
    country_code?: string;
    state?: string;
    postcode?: string;
  };
  boundingbox: [string, string, string, string];
}

export class GeocodingAPI {
  private baseUrl = config.apis.nominatim;
  private delay = 1100; // Respect 1 request per second limit

  private async makeRequest(url: string): Promise<Response> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return fetchWithRetry(url, {
      headers: {
        'User-Agent': 'TravelCompanion/1.0'
      }
    });
  }

  async geocodePlace(query: string) {
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        addressdetails: '1'
      });

      const response = await this.makeRequest(`${this.baseUrl}/search?${params}`);
      const data: NominatimResult[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from geocoding service');
      }
      
      if (data.length === 0) return null;

      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        city: result.address.city,
        country: result.address.country,
        countryCode: result.address.country_code?.toUpperCase()
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return null;
    }
  }

  async reverseGeocode(lat: number, lon: number) {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        addressdetails: '1'
      });

      const response = await this.makeRequest(`${this.baseUrl}/reverse?${params}`);
      const data: NominatimResult = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new APIError('Invalid response from reverse geocoding service');
      }
      
      return {
        displayName: data.display_name,
        city: data.address.city,
        country: data.address.country,
        countryCode: data.address.country_code?.toUpperCase(),
        state: data.address.state
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return null;
    }
  }

  async searchPlaces(query: string, limit = 5) {
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: limit.toString(),
        addressdetails: '1',
        extratags: '1'
      });

      const response = await this.makeRequest(`${this.baseUrl}/search?${params}`);
      const data: NominatimResult[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from place search service');
      }
      
      return data.map(result => ({
        id: result.place_id.toString(),
        name: result.display_name.split(',')[0],
        fullName: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        city: result.address.city,
        country: result.address.country,
        countryCode: result.address.country_code?.toUpperCase()
      }));
    } catch (error) {
      console.error('Place search error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return [];
    }
  }
}

export const geocodingAPI = new GeocodingAPI();
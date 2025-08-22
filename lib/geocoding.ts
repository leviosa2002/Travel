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
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private delay = 1100; // Respect 1 request per second limit

  private async makeRequest(url: string) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return fetch(url, {
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
      
      return {
        displayName: data.display_name,
        city: data.address.city,
        country: data.address.country,
        countryCode: data.address.country_code?.toUpperCase(),
        state: data.address.state
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
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
      return [];
    }
  }
}

export const geocodingAPI = new GeocodingAPI();
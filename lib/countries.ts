import { APIError, fetchWithRetry, config } from './api';
import { Country } from '@/types/country';

export class CountriesAPI {
  private baseUrl = config.apis.restCountries;

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}/all?fields=name,capital,region,subregion,population,area,timezones,currencies,languages,flag,coatOfArms,latlng,cca2,cca3`);
      const data: Country[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from countries API');
      }
      
      return data;
    } catch (error) {
      console.error('Countries API error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return [];
    }
  }

  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}/alpha/${code}`);
      const data: Country[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from countries API');
      }
      
      return data[0] || null;
    } catch (error) {
      console.error('Country by code error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return null;
    }
  }

  async getCountryByName(name: string): Promise<Country | null> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}/name/${name}?exactMatch=true`);
      const data: Country[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from countries API');
      }
      
      return data[0] || null;
    } catch (error) {
      console.error('Country by name error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return null;
    }
  }

  async searchCountries(query: string): Promise<Country[]> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}/name/${query}`);
      const data: Country[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from countries API');
      }
      
      return data;
    } catch (error) {
      console.error('Country search error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return [];
    }
  }

  async getCountriesByRegion(region: string): Promise<Country[]> {
    try {
      const response = await fetchWithRetry(`${this.baseUrl}/region/${region}`);
      const data: Country[] = await response.json();
      
      if (!Array.isArray(data)) {
        throw new APIError('Invalid response from countries API');
      }
      
      return data;
    } catch (error) {
      console.error('Countries by region error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return [];
    }
  }
}

export const countriesAPI = new CountriesAPI();
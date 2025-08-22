import { Country } from '@/types/country';

export class CountriesAPI {
  private baseUrl = 'https://restcountries.com/v3.1';

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all?fields=name,capital,region,subregion,population,area,timezones,currencies,languages,flag,coatOfArms,latlng,cca2,cca3`);
      const data: Country[] = await response.json();
      return data;
    } catch (error) {
      console.error('Countries API error:', error);
      return [];
    }
  }

  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await fetch(`${this.baseUrl}/alpha/${code}`);
      const data: Country[] = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error('Country by code error:', error);
      return null;
    }
  }

  async getCountryByName(name: string): Promise<Country | null> {
    try {
      const response = await fetch(`${this.baseUrl}/name/${name}?exactMatch=true`);
      const data: Country[] = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error('Country by name error:', error);
      return null;
    }
  }

  async searchCountries(query: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/name/${query}`);
      const data: Country[] = await response.json();
      return data;
    } catch (error) {
      console.error('Country search error:', error);
      return [];
    }
  }

  async getCountriesByRegion(region: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/region/${region}`);
      const data: Country[] = await response.json();
      return data;
    } catch (error) {
      console.error('Countries by region error:', error);
      return [];
    }
  }
}

export const countriesAPI = new CountriesAPI();
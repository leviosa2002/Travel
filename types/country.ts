export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  timezones: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  flag: string;
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  latlng: [number, number];
  cca2: string;
  cca3: string;
}
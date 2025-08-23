// Centralized API configuration and error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'TravelCompanion/1.0',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw new APIError('Max retries exceeded');
}

export function createAPIClient(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
  return {
    async get(endpoint: string, params?: Record<string, string>) {
      const url = new URL(endpoint, baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetchWithRetry(url.toString(), {
        method: 'GET',
        headers: defaultHeaders,
      });

      return response.json();
    },

    async post(endpoint: string, data: any) {
      const response = await fetchWithRetry(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
  };
}

// Environment configuration
export const config = {
  apis: {
    wikipedia: 'https://en.wikipedia.org/w/api.php',
    openMeteo: 'https://api.open-meteo.com/v1',
    nominatim: 'https://nominatim.openstreetmap.org',
    restCountries: 'https://restcountries.com/v3.1',
    unsplash: 'https://api.unsplash.com',
  },
  keys: {
    unsplash: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
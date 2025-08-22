import { WeatherData } from '@/types/weather';

export class WeatherAPI {
  private baseUrl = 'https://api.open-meteo.com/v1';

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure,visibility',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
        hourly: 'temperature_2m,weather_code,precipitation',
        timezone: 'auto',
        forecast_days: '7'
      });

      const response = await fetch(`${this.baseUrl}/forecast?${params}`);
      const data = await response.json();

      return {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          humidity: data.current.relative_humidity_2m,
          pressure: data.current.surface_pressure,
          visibility: data.current.visibility
        },
        daily: data.daily.time.map((date: string, index: number) => ({
          date,
          temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
          temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
          weatherCode: data.daily.weather_code[index],
          precipitationSum: data.daily.precipitation_sum[index],
          windSpeedMax: data.daily.wind_speed_10m_max[index]
        })),
        hourly: data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
          time,
          temperature: Math.round(data.hourly.temperature_2m[index]),
          weatherCode: data.hourly.weather_code[index],
          precipitation: data.hourly.precipitation[index]
        }))
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  getWeatherDescription(code: number): string {
    const codes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || 'Unknown';
  }

  getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 55) return '🌦️';
    if (code <= 65) return '🌧️';
    if (code <= 75) return '❄️';
    if (code <= 82) return '🌧️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  }
}

export const weatherAPI = new WeatherAPI();
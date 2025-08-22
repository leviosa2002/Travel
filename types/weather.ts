export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    pressure: number;
    visibility: number;
  };
  daily: {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
    precipitationSum: number;
    windSpeedMax: number;
  }[];
  hourly: {
    time: string;
    temperature: number;
    weatherCode: number;
    precipitation: number;
  }[];
}

export interface AirQuality {
  current: {
    aqi: number;
    pm10: number;
    pm25: number;
    co: number;
    no2: number;
    so2: number;
    o3: number;
  };
  forecast: {
    date: string;
    aqi: number;
  }[];
}
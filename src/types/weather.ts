export interface WeatherData {
  latitude: number;
  longitude: number;
  date?: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  uvIndex?: number;
  icon: string;
  forecastDays?: WeatherData[];
}

export interface CoordinatesResponse {
  success: boolean;
  data?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  weather?: WeatherData;
}

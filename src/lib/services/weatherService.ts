import axios from 'axios';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  condition: string;
  icon: string;
  location: string;
  timestamp: number;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(location: string): Promise<WeatherData | null> {
    try {
      const params = {
        q: location,
        appid: this.apiKey,
        units: 'metric',
      };

      const response = await axios.get(this.baseUrl, { params });
      const data = response.data;

      return {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        location: data.name,
        timestamp: data.dt * 1000,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  getSeasonalRecommendation(temp: number): string {
    if (temp >= 25) return 'summer';
    if (temp >= 15) return 'spring';
    if (temp >= 5) return 'fall';
    return 'winter';
  }
}

export const weatherService = new WeatherService(process.env.NEXT_PUBLIC_WEATHER_API_KEY || '');

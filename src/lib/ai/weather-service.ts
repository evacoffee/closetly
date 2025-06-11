interface WeatherData {
    temperature: number;
    condition: string;
    isRaining: boolean;
    windSpeed: number;
    humidity: number;
  }
  
  export class WeatherService {
    static async getWeather(location: string): Promise<WeatherData> {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        
        return {
          temperature: data.main.temp,
          condition: data.weather[0].main,
          isRaining: data.weather.some((w: any) => 
            ['Rain', 'Drizzle', 'Thunderstorm'].includes(w.main)
          ),
          windSpeed: data.wind.speed,
          humidity: data.main.humidity
        };
      } catch (error) {
        console.error('Error fetching weather:', error);
        // Return default weather data if API fails
        return {
          temperature: 20,
          condition: 'Clear',
          isRaining: false,
          windSpeed: 5,
          humidity: 50
        };
      }
    }
  }
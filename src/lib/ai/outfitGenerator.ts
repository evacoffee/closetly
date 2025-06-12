import { prisma } from '../prisma';
import OpenAI from 'openai';
import { OutfitSuggestion, OutfitGeneratorError } from '@/types/outfit';
import { weatherService } from '../services/weatherService';
import type { WeatherData } from '../services/weatherService';
import axios, { type AxiosError } from 'axios';

interface GenerateOptions {
  occasion: string;
  weather?: {
    temp?: number;
    condition?: string;
    location?: string;
  };
}

export class OutfitGenerator {
  private openai: OpenAI;
  private weatherApiKey: string | undefined;

  constructor() {
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getWeatherData(location: string): Promise<WeatherData | null> {
    if (!this.weatherApiKey) {
      console.warn('Weather API key not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${this.weatherApiKey}&units=metric`
      );

      return {
        temp: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        location: response.data.name,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  async generateOutfitSuggestion(userId: string, occasion: string, location: string = ''): Promise<OutfitSuggestion> {
    try {
      let weather: WeatherData | null = null;
      let seasonalRec = 'all';
      
      if (location) {
        weather = await weatherService.getCurrentWeather(location);
        if (weather) {
          seasonalRec = weatherService.getSeasonalRecommendation(weather.temp);
        }
      }
      
      const wardrobeItems = await prisma.wardrobeItem.findMany({
        where: { userId, status: 'IN_WARDROBE' },
        include: { category: true }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { styleProfile: true }
      });

      if (!wardrobeItems.length) {
        const error = new Error('No items found in your wardrobe. Please add some items first.') as OutfitGeneratorError;
        error.code = 'NO_WARDROBE_ITEMS';
        error.status = 400;
        throw error;
      }

      const weatherContext = weather ? { ...weather, seasonalRec } : null;
      const prompt = this.buildPrompt(wardrobeItems, user?.styleProfile, occasion, weatherContext);
      
      const systemMessage = `You are a professional fashion stylist with expertise in creating stylish outfits. 
      Consider the following when creating outfits:
      - Color coordination and contrast
      - Weather appropriateness
      - Occasion-appropriate formality
      - Current fashion trends
      - User's personal style preferences
      - Fit and comfort
      
      Always respond with a valid JSON object in the specified format.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      try {
        return this.parseAIResponse(content);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        const error = new Error('Failed to process the outfit suggestion') as OutfitGeneratorError;
        error.code = 'PARSE_ERROR';
        error.status = 500;
        throw error;
      }
    } catch (error) {
      console.error('Error generating outfit:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError.response?.data as any)?.message || axiosError.message;
        const apiError = new Error(`Failed to generate outfit: ${errorMessage}`) as OutfitGeneratorError;
        apiError.code = axiosError.code || 'API_ERROR';
        apiError.status = (axiosError.response?.status as number) || 500;
        throw apiError;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate outfit suggestion';
      const genError = new Error(errorMessage) as OutfitGeneratorError;
      genError.code = 'GENERATION_ERROR';
      genError.status = 500;
      throw genError;
    }
  }

  private buildPrompt(wardrobeItems: any[], styleProfile: any, occasion: string, weather: (Partial<WeatherData> & { seasonalRec?: string }) | null): string {
    let prompt = `Create a stylish and appropriate outfit for a ${occasion} occasion. `;
    
    if (weather) {
      const condition = weather.condition ? `The current weather is ${weather.condition}` : '';
      const temp = typeof weather.temp === 'number' ? ` with a temperature of ${weather.temp}°C` : '';
      prompt += `${condition}${temp}. `;
      
      if (weather.humidity && weather.humidity > 70) prompt += 'It\'s quite humid. ';
      if (weather.windSpeed && weather.windSpeed > 20) prompt += 'It\'s quite windy. ';
      if (typeof weather.temp === 'number' && weather.temp < 10) prompt += 'It\'s quite cold. ';
      if (typeof weather.temp === 'number' && weather.temp > 25) prompt += 'It\'s quite hot. ';
    }

    const itemsList = wardrobeItems.map(item => 
      `- ${item.name} (${item.category?.name || 'Uncategorized'})`
    ).join('\n');

    const styleInfo = styleProfile ? `
Style Preferences:
- Favorite Colors: ${styleProfile.favoriteColors?.join(', ') || 'Not specified'}
- Preferred Styles: ${styleProfile.preferredStyles?.join(', ') || 'Not specified'}
- Avoid: ${styleProfile.avoidStyles?.join(', ') || 'None'}
` : 'No style profile found. Using general fashion guidelines.';

    const weatherContext = weather ? `
Weather Conditions:
- Temperature: ${weather.temp}°C
- Condition: ${weather.condition}
${weather.location ? `- Location: ${weather.location}` : ''}
` : 'No weather information provided.';

    return `Create a stylish outfit for the following occasion: ${occasion}

Available Wardrobe Items:
${itemsList}

${styleInfo}
${weatherContext}

Please provide a detailed outfit suggestion including:
1. Outfit name
2. List of items to wear (from the available wardrobe)
3. Description of why this outfit works
4. Styling tips
5. Alternative items that could work

Format your response as a JSON object with the following structure:
{
  "outfitName": "string",
  "items": ["string"],
  "description": "string",
  "stylingTips": ["string"],
  "alternatives": ["string"]
}`;
  }

  private parseAIResponse(response: string): any {
    try {
      const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Invalid response format from AI');
    }
  }
}

export const outfitGenerator = new OutfitGenerator();

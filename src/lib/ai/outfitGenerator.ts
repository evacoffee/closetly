import { prisma } from '../prisma';
import { Configuration, OpenAIApi } from 'openai';
import axios, { AxiosError } from 'axios';
import { OutfitSuggestion, OutfitGeneratorError } from '@/types/outfit';

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
}

interface GenerateOptions {
  occasion: string;
  weather?: {
    temp?: number;
    condition?: string;
    location?: string;
  };
}

export class OutfitGenerator {
  private openai: OpenAIApi;
  private weatherApiKey: string | undefined;

  constructor() {
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
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

  async generateOutfitSuggestion(userId: string, occasion: string, weatherData: any = null): Promise<OutfitSuggestion> {
    try {
      let weather = weatherData;
      
      // If weather data includes location string, fetch actual weather
      if (weatherData?.location && typeof weatherData.location === 'string') {
        weather = await this.getWeatherData(weatherData.location) || weatherData;
      }
      
      // Get user's wardrobe items
      const wardrobeItems = await prisma.wardrobeItem.findMany({
        where: { userId, status: 'IN_WARDROBE' },
        include: { category: true }
      });

      // Get user's style preferences
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { styleProfile: true }
      });

      // Validate input
      if (!wardrobeItems.length) {
        const error = new Error('No items found in your wardrobe. Please add some items first.') as OutfitGeneratorError;
        error.code = 'NO_WARDROBE_ITEMS';
        error.status = 400;
        throw error;
      }

      // Prepare prompt for AI with enhanced context
      const prompt = this.buildPrompt(wardrobeItems, user?.styleProfile, occasion, weather);
      
      // Add system message with fashion guidelines
      const systemMessage = `You are a professional fashion stylist with expertise in creating stylish outfits. 
      Consider the following when creating outfits:
      - Color coordination and contrast
      - Weather appropriateness
      - Occasion-appropriate formality
      - Current fashion trends
      - User's personal style preferences
      - Fit and comfort
      
      Always respond with a valid JSON object in the specified format.`;

      const completion = await this.openai.createChatCompletion({
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
        max_tokens: 1000,
      });

      const response = completion.data.choices[0]?.message?.content || '';
      
      try {
        return this.parseAIResponse(response);
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

  private buildPrompt(wardrobeItems: any[], styleProfile: any, occasion: string, weather: any): string {
    let prompt = `Create a stylish and appropriate outfit for a ${occasion} occasion. `;
    
    if (weather) {
      prompt += `The current weather in ${weather.location} is ${weather.temp}°C, ${weather.condition}. `;
      if (weather.humidity > 70) prompt += 'High humidity. ';
      if (weather.windSpeed > 15) prompt += 'It\'s quite windy. ';
      if (weather.temp < 10) prompt += 'It\'s quite cold, so suggest warmer layers. ';
      if (weather.temp > 25) prompt += 'It\'s warm, so suggest lighter clothing. ';
    }

    if (styleProfile) {
      prompt += `The user's style is ${styleProfile.styleType}. `;
      prompt += `Favorite colors: ${styleProfile.favoriteColors?.join(', ')}. `;
    }

    prompt += '\n\nAvailable items in wardrobe (format: Name - Category - Color - Notes):\n';
    wardrobeItems.forEach(item => {
      prompt += `- ${item.name} - ${item.category?.name || 'Uncategorized'} - ${item.color || 'No color specified'}`;
      if (item.material) prompt += ` - Material: ${item.material}`;
      if (item.brand) prompt += ` - Brand: ${item.brand}`;
      if (item.notes) prompt += ` - Notes: ${item.notes}`;
      prompt += '\n';
    });

    prompt += '\n\nPlease suggest a complete outfit using these items. Format your response as a valid JSON object with these fields: ';
    prompt += 'outfitName (creative name for the outfit), ';
    prompt += 'items (array of item IDs), ';
    prompt += 'description (detailed description of the outfit), ';
    prompt += 'occasion (the occasion this is suitable for), ';
    prompt += 'stylingTips (3-5 bullet points with styling suggestions), ';
    prompt += 'alternatives (suggestions for similar items that could work if the suggested items are not available).'

    return prompt;
  }

  private parseAIResponse(response: string): any {
    try {
      // Extract JSON from markdown code block if present
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

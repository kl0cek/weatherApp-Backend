import axios from 'axios';

import { fetchWeatherData, parseDailySummary, parseWeeklySummary } from '../app/forecast/weatherService.js';

jest.mock('axios');
const mockedAxios = axios;

describe('Weather Service', () => {
  const mockWeatherData = {
    daily: {
      time: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
      weather_code: [1, 2, 3, 61, 62, 1, 0],
      temperature_2m_min: [5, 3, 2, 8, 6, 4, 7],
      temperature_2m_max: [15, 13, 12, 18, 16, 14, 17],
      sunshine_duration: [7200, 14400, 3600, 0, 1800, 10800, 21600],
      surface_pressure_max: [1020, 1015, 1018, 1012, 1025, 1022, 1019],
      surface_pressure_min: [1010, 1005, 1008, 1002, 1015, 1012, 1009],
      precipitation_sum: [0, 0, 0, 5.2, 8.1, 0, 0]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWeatherData', () => {
    test('should fetch weather data successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

      const result = await fetchWeatherData(52.2297, 21.0122);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: 52.2297,
            longitude: 21.0122,
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunshine_duration,surface_pressure_mean,precipitation_sum,surface_pressure_max,surface_pressure_min',
            timezone: 'auto'
          }
        }
      );

      expect(result).toEqual(mockWeatherData);
    });
  });

  describe('parseDailySummary', () => {
    test('should parse daily summary correctly', () => {
      const result = parseDailySummary(mockWeatherData);

      expect(result).toHaveProperty('daily');
      expect(result.daily).toHaveLength(7);

      const firstDay = result.daily[0];
      expect(firstDay).toEqual({
        date: '01/01/2024',
        weathercode: 1,
        temperature_min: 5,
        temperature_max: 15,
        solar_energy: 1.0 
      });

      
      const secondDay = result.daily[1];
      expect(secondDay.solar_energy).toBe(2.0); 
    });

    test('should handle zero sunshine duration', () => {
      const testData = {
        daily: {
          time: ['2024-01-01'],
          weather_code: [61],
          temperature_2m_min: [8],
          temperature_2m_max: [18],
          sunshine_duration: [0]
        }
      };

      const result = parseDailySummary(testData);
      expect(result.daily[0].solar_energy).toBe(0);
    });
  });

  describe('parseWeeklySummary', () => {
    test('should parse weekly summary correctly', () => {
      const result = parseWeeklySummary(mockWeatherData);

      expect(result).toHaveProperty('average_pressure');
      expect(result).toHaveProperty('average_sunshine');
      expect(result).toHaveProperty('min_temperature');
      expect(result).toHaveProperty('max_temperature');
      expect(result).toHaveProperty('summary');

    
      expect(result.min_temperature).toBe(2); 
      expect(result.max_temperature).toBe(18); 
      
      expect(result.average_pressure).toBeCloseTo(1013.7, 1);

      expect(result.average_sunshine).toBeCloseTo(2.4, 1);

      expect(result.summary).toBe('2 rainy days - sunny week');
    });

    test('should classify as rainy week when 4+ rainy days', () => {
      const rainyWeekData = {
        daily: {
          time: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
          weather_code: [61, 62, 63, 61, 62],
          temperature_2m_min: [5, 3, 2, 8, 6],
          temperature_2m_max: [15, 13, 12, 18, 16],
          sunshine_duration: [7200, 14400, 3600, 0, 1800],
          surface_pressure_max: [1020, 1015, 1018, 1012, 1025],
          surface_pressure_min: [1010, 1005, 1008, 1002, 1015],
          precipitation_sum: [5.2, 8.1, 2.3, 1.5, 0]
        }
      };

      const result = parseWeeklySummary(rainyWeekData);
      expect(result.summary).toBe('4 rainy days - rainy week');
    });
  });
});
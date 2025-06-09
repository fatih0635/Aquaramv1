import axios from 'axios';

const API_KEY = '2c74306d0f77d2634e4eb2fe4974307d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherByCity(city) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        units: 'metric',
        appid: API_KEY,
      },
    });

    const data = response.data;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const rain = data.rain ? data.rain['1h'] || 0 : 0;
    const icon = data.weather?.[0]?.icon || '01d';
    const description = data.weather?.[0]?.description || 'clear sky';

    return {
      temp,
      humidity,
      rain,
      icon,
      description,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}

// 🌦️ Hava durumuna bağlı su önerisi etkisi
export function calculateWeatherEffect(temp, rain) {
  let modifier = 0;

  if (temp >= 35) modifier += 150;
  else if (temp >= 30) modifier += 100;
  else if (temp >= 25) modifier += 50;
  else if (temp <= 10) modifier -= 50;

  if (rain > 0) modifier -= rain * 25;

  return modifier;
}

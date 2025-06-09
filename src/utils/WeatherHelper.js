import axios from 'axios';

const API_KEY = '1a95a747788ef180540ae6100e98bb05';

// 🌤️ Hava durumu bilgisini getir (Weatherstack)
export async function getWeatherByCity(city) {
  const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(city)}`;

  try {
    const response = await axios.get(url);

    const data = response.data;
    const temp = data.current.temperature;
    const humidity = data.current.humidity;
    const rain = data.current.precip || 0;
    const icon = data.current.weather_icons?.[0] || '';
    const description = data.current.weather_descriptions?.[0] || 'clear sky';

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

// 💧 Sıcaklık ve yağışa bağlı su ihtiyacı etkisi
export function calculateWeatherEffect(temp, rain) {
  let modifier = 0;

  if (temp >= 35) modifier += 150;
  else if (temp >= 30) modifier += 100;
  else if (temp >= 25) modifier += 50;
  else if (temp <= 10) modifier -= 50;

  if (rain > 0) modifier -= rain * 25;

  return modifier;
}

// 🌤️ Açıklamaya göre emoji döndür
export function getWeatherEmoji(description) {
  const desc = description.toLowerCase();

  if (desc.includes('sun') || desc.includes('clear')) return '☀️';
  if (desc.includes('rain')) return '🌧️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
  if (desc.includes('fog') || desc.includes('mist')) return '🌫️';

  return '🔴'; // fallback emoji
}

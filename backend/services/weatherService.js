const axios = require('axios');

exports.getWeather = async (params = {}) => {
  const { city, lat, lon, mockWeather, mockTemp } = params;

  // 1. Check if frontend requested a simulated override
  if (mockWeather) {
    let temp = parseFloat(mockTemp) || 20;
    let condition = mockWeather; // 'Chuva', 'Ensolarado', 'Frio', etc.
    let name = city || 'Cidade Simulada';
    
    return {
      temp,
      condition,
      city: name,
      isMock: true,
      simulated: true
    };
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  // 2. If no API key is available, return default mock weather
  if (!apiKey) {
    // Return a default mock weather that is "Chuva" (Rainy) for a cozy atmosphere
    return {
      temp: 16,
      condition: 'Chuva',
      city: 'São Paulo (Mock)',
      isMock: true,
      simulated: false
    };
  }

  // 3. Call OpenWeatherMap API
  try {
    let url = '';
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
    } else {
      const searchCity = city || 'Sao Paulo';
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&appid=${apiKey}&units=metric&lang=pt_br`;
    }

    const response = await axios.get(url);
    const data = response.data;

    const temp = data.main.temp;
    const weatherMain = data.weather[0].main.toLowerCase();
    const weatherDesc = data.weather[0].description;
    
    // Map OpenWeather conditions to CineMood weather conditions: 'Chuva', 'Ensolarado', 'Frio', 'Nublado'
    let condition = 'Nublado'; // default
    
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle') || weatherMain.includes('thunderstorm')) {
      condition = 'Chuva';
    } else if (temp <= 15) {
      condition = 'Frio';
    } else if (weatherMain.includes('clear') || weatherMain.includes('sun')) {
      condition = 'Ensolarado';
    } else if (weatherMain.includes('cloud')) {
      condition = 'Nublado';
    }

    // Additional override if it's freezing
    if (temp <= 10) {
      condition = 'Frio';
    }

    return {
      temp: Math.round(temp),
      condition,
      description: weatherDesc,
      city: data.name,
      isMock: false
    };
  } catch (error) {
    console.error('[Weather Service] API call failed, falling back to mock:', error.message);
    return {
      temp: 24,
      condition: 'Ensolarado',
      city: city || 'Rio de Janeiro (Fallback)',
      isMock: true,
      error: error.message
    };
  }
};

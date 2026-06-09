const movieService = require('../services/movieService');
const weatherService = require('../services/weatherService');

exports.getTrending = async (req, res) => {
  try {
    const movies = await movieService.getTrending();
    return res.json(movies);
  } catch (error) {
    console.error('[Movie Controller] getTrending Error:', error.message);
    return res.status(500).json({ message: 'Erro ao carregar filmes em alta.' });
  }
};

exports.search = async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await movieService.searchMovies(query);
    return res.json(movies);
  } catch (error) {
    console.error('[Movie Controller] search Error:', error.message);
    return res.status(500).json({ message: 'Erro ao pesquisar filmes.' });
  }
};

exports.getDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await movieService.getMovieDetails(id);
    return res.json(movie);
  } catch (error) {
    console.error('[Movie Controller] getDetails Error:', error.message);
    return res.status(404).json({ message: error.message || 'Filme não encontrado.' });
  }
};

exports.surpriseMe = async (req, res) => {
  try {
    const movie = await movieService.getRandomMovie();
    return res.json(movie);
  } catch (error) {
    console.error('[Movie Controller] surpriseMe Error:', error.message);
    return res.status(500).json({ message: 'Erro ao escolher um filme aleatório.' });
  }
};

exports.getRecommendations = async (req, res) => {
  // Query parameters:
  // city: target city
  // lat, lon: geolocation from browser
  // mood: 'Feliz', 'Triste', 'Ansioso', 'Entediado', 'Cansado'
  // mockWeather: 'Chuva', 'Ensolarado', 'Frio', etc.
  // mockTemp: '16'
  const { city, lat, lon, mood, mockWeather, mockTemp } = req.query;

  try {
    // 1. Resolve Weather
    const weather = await weatherService.getWeather({
      city,
      lat,
      lon,
      mockWeather,
      mockTemp
    });

    // 2. Fetch Recommended Movies
    const movies = await movieService.getRecommended(weather.condition, mood);

    // 3. Return both the weather status and recommended movies
    return res.json({
      weather: {
        city: weather.city,
        temp: weather.temp,
        condition: weather.condition,
        description: weather.description || weather.condition,
        isMock: weather.isMock,
        simulated: weather.simulated
      },
      movies: movies
    });
  } catch (error) {
    console.error('[Movie Controller] getRecommendations Error:', error.message);
    return res.status(500).json({ message: 'Erro ao gerar recomendações de filmes.' });
  }
};

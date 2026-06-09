import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState({
    city: 'Carregando...',
    temp: 22,
    condition: 'Chuva', // Default cozy starting condition
    description: 'Carregando clima...',
    isMock: true,
    simulated: false
  });
  const [mood, setMood] = useState('Feliz'); // Default mood
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  // Simulation parameters (empty by default)
  const [simOverride, setSimOverride] = useState({
    active: false,
    condition: 'Chuva',
    temp: 16,
    city: 'Gramado'
  });

  // Fetch coordinates on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('[WeatherContext] Geolocation permission denied or failed:', error.message);
          setCoords(null); // Will fall back to IP/City in backend
        }
      );
    }
  }, []);

  // Fetch recommendations and weather
  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      let params = { mood };

      if (simOverride.active) {
        params.mockWeather = simOverride.condition;
        params.mockTemp = simOverride.temp;
        params.city = simOverride.city;
      } else if (coords) {
        params.lat = coords.lat;
        params.lon = coords.lon;
      }

      const response = await api.get('/movies/recommendations', { params });
      
      setWeather(response.data.weather);
      setMovies(response.data.movies);
    } catch (error) {
      console.error('[WeatherContext] Error fetching weather recommendations:', error.message);
    } finally {
      setLoading(false);
    }
  }, [mood, coords, simOverride]);

  // Refetch when dependencies change
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const updateCityWeather = async (cityName) => {
    if (!cityName || cityName.trim() === '') return;
    setLoading(true);
    try {
      let params = { mood, city: cityName };
      const response = await api.get('/movies/recommendations', { params });
      setWeather(response.data.weather);
      setMovies(response.data.movies);
      // If we looked up a specific city, clear coordinates so we stick to this city
      setCoords(null);
      setSimOverride(prev => ({ ...prev, active: false })); // turn off override if searching custom city
    } catch (error) {
      console.error('[WeatherContext] Error searching city weather:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const applySimulation = (condition, temp, city) => {
    setSimOverride({
      active: true,
      condition,
      temp: parseInt(temp, 10),
      city
    });
  };

  const clearSimulation = () => {
    setSimOverride(prev => ({ ...prev, active: false }));
    // Geolocation coords will automatically kick back in or server defaults
  };

  return (
    <WeatherContext.Provider value={{
      weather,
      mood,
      movies,
      loading,
      setMood,
      updateCityWeather,
      applySimulation,
      clearSimulation,
      simOverrideActive: simOverride.active,
      simOverrideDetails: simOverride,
      refetch: fetchRecommendations
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather deve ser usado com um WeatherProvider');
  }
  return context;
};
export default WeatherContext;

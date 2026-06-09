import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import api from '../services/api';
import WeatherControlPanel from '../components/WeatherControlPanel';
import MovieCarousel from '../components/MovieCarousel';
import MovieCard from '../components/MovieCard';
import { Sparkles, CloudRain, Flame, Search, X, Clapperboard, HelpCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { weather, mood, movies: weatherMovies, loading: weatherLoading } = useWeather();

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Carousel States
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  
  const [communityMovies, setCommunityMovies] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);

  // Refs for scrolling actions
  const weatherRef = useRef(null);
  const trendingRef = useRef(null);

  // Fetch static carousels on mount
  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        // Fetch trending
        const trendingRes = await api.get('/movies/trending');
        setTrendingMovies(trendingRes.data);
      } catch (err) {
        console.error('Error fetching trending:', err.message);
      } finally {
        setTrendingLoading(false);
      }

      try {
        // Fetch community favorites
        const communityRes = await api.get('/favorites/community/popular');
        setCommunityMovies(communityRes.data);
      } catch (err) {
        console.error('Error fetching community popular:', err.message);
      } finally {
        setCommunityLoading(false);
      }
    };

    fetchCarousels();
  }, []);

  // Handle live search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      
      setSearchLoading(true);
      try {
        const response = await api.get(`/movies/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error('Search error:', err.message);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Quick Action 1: Me Surpreenda
  const handleSurpriseMe = async () => {
    try {
      const response = await api.get('/movies/surprise');
      const movie = response.data;
      if (movie && movie.id) {
        navigate(`/movie/${movie.id}`);
      }
    } catch (err) {
      console.error('Error in surprise me:', err.message);
    }
  };

  // Quick Action 2: Focus Weather Simulator
  const focusWeather = () => {
    if (weatherRef.current) {
      weatherRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Quick Action 3: Focus Trending
  const focusTrending = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Personalized section: filter a different slice or shuffle for "Recomendados Para Você"
  const getPersonalizedMovies = () => {
    // Reverse or slice to show a slightly different combination based on weather recommendations
    return [...weatherMovies].reverse();
  };

  const isSearching = searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 flex flex-col gap-8">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden py-12 px-6 md:p-16 text-center md:text-left bg-gradient-to-r from-slate-950 via-slate-900/90 to-brand-primary/10 border border-slate-800/60 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Decorative Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

        <div className="flex-1 flex flex-col gap-4 relative z-10">
          <span className="self-center md:self-start bg-brand-primary/20 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full border border-brand-primary/30">
            Descubra novos horizontes cinematográficos
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-title text-brand-text leading-tight">
            Filmes perfeitos para o seu <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Humor</span> e o seu <span className="bg-gradient-to-r from-brand-accent to-yellow-400 bg-clip-text text-transparent">Clima</span>.
          </h1>
          <p className="text-sm md:text-base text-brand-text-secondary max-w-xl">
            Deixe o CineMood analisar a temperatura e o clima da sua região, combine com o seu estado de espírito e encontre a indicação perfeita para hoje.
          </p>
        </div>

        {/* Large Logo Graphics */}
        <div className="h-44 w-44 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center p-0.5 shadow-2xl shadow-brand-primary/10 shrink-0 relative z-10 animate-bounce-slow hidden lg:flex">
          <div className="h-full w-full bg-slate-950 rounded-full flex flex-col items-center justify-center gap-1">
            <Clapperboard className="h-14 w-14 text-brand-primary" />
            <span className="text-xs font-bold tracking-widest text-brand-text-secondary font-title uppercase">CineMood</span>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar filmes por nome, gênero ou palavra-chave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-800 focus:border-brand-primary rounded-full pl-12 pr-12 py-3.5 text-base text-brand-text placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-lg shadow-black/30"
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results / Home Content */}
      {isSearching ? (
        <div className="py-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold font-title text-brand-text">
              Resultados para "{searchQuery}"
            </h2>
            <span className="text-xs text-brand-text-secondary">
              {searchResults.length} {searchResults.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
            </span>
          </div>

          {searchLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="aspect-[2/3] w-full bg-slate-800/50 rounded-lg animate-pulse border border-slate-700/30" />
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 border border-slate-800/60 rounded-2xl max-w-xl mx-auto flex flex-col items-center gap-4">
              <HelpCircle className="h-12 w-12 text-slate-600" />
              <div>
                <p className="text-brand-text font-semibold">Nenhum resultado encontrado</p>
                <p className="text-xs text-brand-text-secondary mt-1">Verifique a ortografia ou procure por outros termos.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Quick Actions Panel */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold font-title text-brand-text-secondary px-1 uppercase tracking-wider text-xs">
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Action 1: Me Surpreenda */}
              <button
                onClick={handleSurpriseMe}
                className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-brand-primary/10 hover:border-brand-primary/40 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/5 cursor-pointer text-left"
              >
                <div className="h-12 w-12 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-md">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text font-title text-sm group-hover:text-brand-primary transition-colors">🎲 Me Surpreenda</h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Indicação aleatória e rápida</p>
                </div>
              </button>

              {/* Action 2: Mood & Clima */}
              <button
                onClick={focusWeather}
                className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-brand-accent/10 hover:border-brand-accent/40 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/5 cursor-pointer text-left"
              >
                <div className="h-12 w-12 rounded-xl bg-pink-950/80 border border-pink-850 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300 shadow-md">
                  <CloudRain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text font-title text-sm group-hover:text-brand-accent transition-colors">🌤️ Mood & Clima</h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Ajustar clima e humor</p>
                </div>
              </button>

              {/* Action 3: Em Alta */}
              <button
                onClick={focusTrending}
                className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-yellow-500/10 hover:border-yellow-500/30 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/5 cursor-pointer text-left"
              >
                <div className="h-12 w-12 rounded-xl bg-yellow-950/60 border border-yellow-900/50 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-300 shadow-md">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text font-title text-sm group-hover:text-yellow-400 transition-colors">🔥 Em Alta</h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Ver as tendências da semana</p>
                </div>
              </button>

            </div>
          </div>

          {/* Simulator Panel (Scroll anchor) */}
          <div ref={weatherRef}>
            <WeatherControlPanel />
          </div>

          {/* Carousel 1: Perfeito para o Clima de Hoje */}
          <MovieCarousel
            title={`Perfeito para o Clima de Hoje (${weather.condition})`}
            movies={weatherMovies}
            loading={weatherLoading}
          />

          {/* Carousel 2: Recomendados para Você */}
          <MovieCarousel
            title={`Recomendados Para Quem Está: ${mood}`}
            movies={getPersonalizedMovies()}
            loading={weatherLoading}
          />

          {/* Carousel 3: Favoritos da Comunidade */}
          <MovieCarousel
            title="Favoritos da Comunidade"
            movies={communityMovies}
            loading={communityLoading}
          />

          {/* Carousel 4: Tendências da Semana (Scroll anchor) */}
          <div ref={trendingRef}>
            <MovieCarousel
              title="Tendências da Semana"
              movies={trendingMovies}
              loading={trendingLoading}
            />
          </div>
        </>
      )}

    </div>
  );
};

export default Home;

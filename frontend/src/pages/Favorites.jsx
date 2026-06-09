import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { Heart, Search } from 'lucide-react';

const Favorites = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-t-brand-primary border-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-brand-text-secondary text-sm">Carregando seus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="border-b border-slate-850 pb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
          <Heart className="h-5 w-5 fill-brand-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-title text-brand-text">Seus Favoritos</h1>
          <p className="text-xs text-brand-text-secondary">Filmes salvos na sua conta</p>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/15 border border-slate-800/60 rounded-2xl max-w-xl mx-auto flex flex-col items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-brand-text font-bold text-base">Sua lista está vazia</h3>
            <p className="text-xs text-brand-text-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">
              Você ainda não favoritou nenhum filme. Quando encontrar algo interessante, clique em "Favoritar" para salvar.
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white transition-all cursor-pointer hover:scale-105"
          >
            <Search className="h-4 w-4" /> Explorar Filmes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="flex justify-center">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Favorites;

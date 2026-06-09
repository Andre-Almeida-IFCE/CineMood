import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const { id, title, poster_path, vote_average, release_date, genres } = movie;

  // Format TMDB image URL
  const getPosterUrl = () => {
    if (poster_path) {
      if (poster_path.startsWith('http')) return poster_path;
      return `https://image.tmdb.org/t/p/w500${poster_path}`;
    }
    // High-quality cinematic fallback placeholder
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
  };

  const getReleaseYear = () => {
    if (!release_date || release_date === 'N/A') return '';
    return release_date.split('-')[0];
  };

  return (
    <Link
      to={`/movie/${id}`}
      className="group relative flex flex-col w-[160px] sm:w-[200px] shrink-0 rounded-lg overflow-hidden bg-slate-900/90 border border-slate-800/80 hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-primary/10"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950 relative">
        <img
          src={getPosterUrl()}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
          }}
        />

        {/* Hover overlay with details */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex justify-center mb-4">
            <span className="bg-brand-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md shadow-brand-primary/30">
              <Eye className="h-3.5 w-3.5" /> Detalhes
            </span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center gap-0.5 border border-yellow-500/20">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {vote_average > 0 ? vote_average.toFixed(1) : 'N/A'}
        </div>
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-primary transition-colors duration-300 line-clamp-1 mb-1 font-title">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
            <span>{getReleaseYear()}</span>
            {genres && genres.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="line-clamp-1">{genres[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

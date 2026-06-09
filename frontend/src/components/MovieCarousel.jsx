import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieCarousel = ({ title, movies = [], loading = false }) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <h2 className="text-lg font-bold font-title text-brand-text mb-4 px-1">{title}</h2>
        <div className="flex gap-4 overflow-hidden py-2">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="w-[160px] sm:w-[200px] aspect-[2/3] shrink-0 bg-slate-800/50 rounded-lg animate-pulse border border-slate-700/30" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="py-6">
        <h2 className="text-lg font-bold font-title text-brand-text mb-2 px-1">{title}</h2>
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-8 text-center text-sm text-brand-text-secondary">
          Nenhum filme disponível nesta categoria no momento.
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/carousel py-6">
      <h2 className="text-lg md:text-xl font-bold font-title text-brand-text mb-4 px-1 flex items-center gap-2">
        {title}
        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-brand-text-secondary font-normal font-sans">
          {movies.length} {movies.length === 1 ? 'item' : 'itens'}
        </span>
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-slate-950/80 hover:bg-brand-primary p-2 rounded-full border border-slate-800 hover:border-brand-primary/50 text-white shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 pointer-events-auto cursor-pointer"
          title="Rolar para esquerda"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-2 scroll-smooth hide-scrollbar px-1"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-slate-950/80 hover:bg-brand-primary p-2 rounded-full border border-slate-800 hover:border-brand-primary/50 text-white shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 pointer-events-auto cursor-pointer"
          title="Rolar para direita"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
};

export default MovieCarousel;

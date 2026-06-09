import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Star, MessageSquare, Calendar, ArrowUpRight } from 'lucide-react';

const Community = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await api.get('/reviews/feed');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching community feed:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-t-brand-primary border-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-brand-text-secondary text-sm">Carregando feed da comunidade...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="border-b border-slate-850 pb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-title text-brand-text">Comunidade CineMood</h1>
          <p className="text-xs text-brand-text-secondary">O que as pessoas estão assistindo e avaliando</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/15 border border-slate-800/60 rounded-2xl max-w-xl mx-auto flex flex-col items-center gap-4">
          <MessageSquare className="h-12 w-12 text-slate-600" />
          <div>
            <h3 className="text-brand-text font-bold text-base">Silêncio no set...</h3>
            <p className="text-xs text-brand-text-secondary mt-1 max-w-xs mx-auto leading-relaxed">
              Nenhuma avaliação foi publicada na comunidade ainda. Escolha um filme e deixe sua opinião!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          {reviews.map((r) => {
            const getPosterUrl = () => {
              if (r.movie?.poster_path) {
                if (r.movie.poster_path.startsWith('http')) return r.movie.poster_path;
                return `https://image.tmdb.org/t/p/w200${r.movie.poster_path}`;
              }
              return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop';
            };

            return (
              <div
                key={r.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm flex gap-5 items-start transition-all duration-300 hover:border-slate-700"
              >
                
                {/* Movie Miniature Poster */}
                <Link
                  to={`/movie/${r.movie_id}`}
                  className="w-16 sm:w-20 shrink-0 aspect-[2/3] rounded-lg overflow-hidden border border-slate-800 hover:scale-105 transition-transform duration-300 shadow-md bg-slate-950"
                >
                  <img src={getPosterUrl()} alt={r.movie?.title} className="w-full h-full object-cover" />
                </Link>

                {/* Review Details */}
                <div className="flex-1 flex flex-col gap-2">
                  
                  {/* User Profile Header */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs uppercase">
                        {r.user_name.substring(0, 2)}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-brand-text">{r.user_name}</span>
                        <span className="text-slate-650 mx-1.5">•</span>
                        <span className="text-[10px] text-brand-text-secondary">
                          {new Date(r.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-0.5 bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded-full">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Movie Title Reference */}
                  <div className="mt-1">
                    <span className="text-[11px] text-brand-text-secondary uppercase tracking-wider block">Avaliação sobre</span>
                    <Link
                      to={`/movie/${r.movie_id}`}
                      className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1 font-title"
                    >
                      {r.movie?.title}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Review Text */}
                  {r.comment ? (
                    <p className="text-xs sm:text-sm text-brand-text-secondary mt-1.5 leading-relaxed bg-slate-950/20 p-3 rounded-lg border border-slate-900/60">
                      "{r.comment}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 italic mt-1.5 pl-1">
                      (Nenhum comentário escrito por este usuário)
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Community;

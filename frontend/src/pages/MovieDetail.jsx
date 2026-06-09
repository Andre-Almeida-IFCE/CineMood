import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Star, Heart, Share2, Calendar, Film, Check, AlertTriangle, Send, ShieldAlert } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Load States
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Favorites States
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Reviews States
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Share Alert state
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch Details
        const movieRes = await api.get(`/movies/${id}`);
        setMovie(movieRes.data);

        // 2. Fetch Reviews
        const reviewsRes = await api.get(`/reviews/movie/${id}`);
        setReviews(reviewsRes.data);

        // 3. If Authenticated, check if already favorited
        if (isAuthenticated) {
          const favsRes = await api.get('/favorites');
          const exists = favsRes.data.some(f => f.id === parseInt(id, 10));
          setIsFavorited(exists);
        }
      } catch (err) {
        console.error('Error loading movie:', err.message);
        setError('Não foi possível carregar os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, isAuthenticated]);

  // Handle Share link copy
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  // Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await api.delete(`/favorites/${id}`);
        setIsFavorited(false);
      } else {
        await api.post('/favorites', { movieId: id });
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Favorite toggle error:', err.message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRating < 1 || userRating > 5) return;

    setSubmittingReview(true);
    try {
      const response = await api.post('/reviews', {
        movieId: id,
        rating: userRating,
        comment: userComment
      });

      // Update reviews list (insert or replace existing user review)
      const newReview = response.data;
      setReviews(prev => {
        const index = prev.findIndex(r => r.user_id === user.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = newReview;
          return updated;
        }
        return [newReview, ...prev];
      });

      setUserComment('');
    } catch (err) {
      console.error('Review submit error:', err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-t-brand-primary border-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-brand-text-secondary text-sm">Carregando detalhes do filme...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 text-center flex flex-col items-center gap-4 min-h-[50vh]">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold font-title text-brand-text">{error || 'Filme não encontrado'}</h2>
        <Link to="/" className="text-sm font-semibold bg-slate-800 hover:bg-slate-700 px-6 py-2.5 rounded-full border border-slate-700">
          Voltar para o Início
        </Link>
      </div>
    );
  }

  const { title, original_title, overview, poster_path, backdrop_path, vote_average, genres, release_date } = movie;

  const getPosterUrl = () => {
    if (poster_path) {
      if (poster_path.startsWith('http')) return poster_path;
      return `https://image.tmdb.org/t/p/w500${poster_path}`;
    }
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
  };

  const getBackdropUrl = () => {
    if (backdrop_path) {
      if (backdrop_path.startsWith('http')) return backdrop_path;
      return `https://image.tmdb.org/t/p/original${backdrop_path}`;
    }
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';
  };

  return (
    <div className="w-full relative">
      
      {/* Cinematic Backdrop Banner */}
      <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[70vh] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-slate-950 z-10" />
        <img
          src={getBackdropUrl()}
          alt={title}
          className="w-full h-full object-cover opacity-35 object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 relative z-10 pt-20 md:pt-36">
        
        {/* Movie Info Area */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          
          {/* Poster Box */}
          <div className="w-[220px] sm:w-[280px] shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden movie-shadow border border-slate-800 bg-slate-950">
            <img src={getPosterUrl()} alt={title} className="w-full h-auto object-cover" />
          </div>

          {/* Details Box */}
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left mt-4">
            
            {/* Title & Tag */}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold font-title text-brand-text tracking-wide leading-tight">
                {title}
              </h1>
              {original_title && original_title !== title && (
                <p className="text-sm text-brand-text-secondary italic mt-1 font-sans">
                  Título original: {original_title}
                </p>
              )}
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
              
              {/* Rating */}
              <span className="bg-slate-900 border border-yellow-500/20 text-yellow-400 font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {vote_average > 0 ? vote_average.toFixed(1) : 'N/A'}
              </span>

              {/* Release date */}
              {release_date && release_date !== 'N/A' && (
                <span className="bg-slate-900 border border-slate-800 text-brand-text-secondary px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(release_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}

              {/* Genres */}
              {genres && genres.map(g => (
                <span key={g} className="bg-brand-primary/10 border border-brand-primary/25 text-brand-primary font-semibold px-3 py-1.5 rounded-full">
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-sm font-bold text-brand-text font-title uppercase tracking-wider mb-2">Sinopse</h3>
              <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed max-w-3xl">
                {overview}
              </p>
            </div>

            {/* Interactive Actions */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
              
              {/* Favorite */}
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className={`
                  flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50
                  ${isFavorited
                    ? 'bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/25'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-brand-text'}
                `}
              >
                <Heart className={`h-4.5 w-4.5 ${isFavorited ? 'fill-white text-white' : ''}`} />
                {isFavorited ? 'Favoritado' : 'Favoritar'}
              </button>

              {/* Share */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-brand-text transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Share2 className="h-4.5 w-4.5" />
                  Compartilhar
                </button>
                {shareSuccess && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-green-400 border border-green-900 text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-xl animate-fadeIn">
                    Link copiado!
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-850 pt-12">
          
          {/* Write a Review Block */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <h2 className="text-xl font-bold font-title text-brand-text">Avalie este Filme</h2>
            
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col gap-4">
                
                {/* Score Stars */}
                <div>
                  <label className="text-xs text-brand-text-secondary font-medium block mb-2">Sua Nota</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`h-8 w-8 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div>
                  <label className="text-xs text-brand-text-secondary font-medium block mb-2">Seu Comentário</label>
                  <textarea
                    rows={4}
                    placeholder="Escreva sua opinião sobre este filme..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-primary rounded-xl px-4 py-3 text-sm text-brand-text placeholder-slate-700 focus:outline-none transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-sm transition-all shadow-md shadow-brand-primary/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {submittingReview ? 'Enviando...' : 'Publicar Avaliação'}
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center text-center gap-4">
                <ShieldAlert className="h-10 w-10 text-brand-primary" />
                <div>
                  <p className="text-brand-text font-semibold text-sm">Faça parte da Comunidade</p>
                  <p className="text-xs text-brand-text-secondary mt-1">Conecte-se para compartilhar sua avaliação e comentários sobre este filme.</p>
                </div>
                <Link to="/login" className="text-xs font-bold bg-brand-primary hover:bg-brand-primary/80 text-white px-5 py-2.5 rounded-full mt-2 transition-all hover:scale-105">
                  Fazer Login
                </Link>
              </div>
            )}
          </div>

          {/* List of Reviews Block */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold font-title text-brand-text flex items-center gap-2">
              Avaliações da Comunidade
              <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded-full text-brand-text-secondary font-normal font-sans">
                {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
              </span>
            </h2>

            {reviews.length === 0 ? (
              <div className="p-8 border border-slate-800 bg-slate-900/10 rounded-2xl text-center text-sm text-brand-text-secondary italic">
                Ninguém avaliou este filme ainda. Seja o primeiro!
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/20 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-sm uppercase">
                          {r.user_name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-text">{r.user_name}</p>
                          <p className="text-[10px] text-brand-text-secondary">
                            {new Date(r.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                    </div>

                    {r.comment && (
                      <p className="text-sm text-brand-text-secondary leading-relaxed pl-1">
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MovieDetail;

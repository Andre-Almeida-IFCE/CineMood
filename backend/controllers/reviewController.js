const db = require('../database/db');
const movieService = require('../services/movieService');

exports.getByMovie = async (req, res) => {
  const { movieId } = req.params;

  try {
    const result = await db.query(
      `SELECT r.id, r.user_id, r.movie_id, r.rating, r.comment, r.created_at, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.movie_id = $1 
       ORDER BY r.created_at DESC`,
      [parseInt(movieId, 10)]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('[Review Controller] getByMovie Error:', error.message);
    return res.status(500).json({ message: 'Erro ao carregar avaliações do filme.' });
  }
};

exports.create = async (req, res) => {
  const userId = req.user.id;
  const { movieId, rating, comment } = req.body;

  if (!movieId || rating === undefined) {
    return res.status(400).json({ message: 'O ID do filme (movieId) e a nota (rating) são obrigatórios.' });
  }

  const numRating = parseInt(rating, 10);
  if (numRating < 1 || numRating > 5) {
    return res.status(400).json({ message: 'A nota deve ser um número inteiro de 1 a 5.' });
  }

  try {
    // Insert review
    const result = await db.query(
      `INSERT INTO reviews (user_id, movie_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING id, user_id, movie_id, rating, comment, created_at`,
      [userId, parseInt(movieId, 10), numRating, comment || '']
    );

    const newReview = result.rows[0];

    // Return review along with user name
    return res.status(201).json({
      ...newReview,
      user_name: req.user.name
    });
  } catch (error) {
    console.error('[Review Controller] create Error:', error.message);
    return res.status(500).json({ message: 'Erro ao salvar avaliação.' });
  }
};

exports.getCommunityFeed = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.id, r.user_id, r.movie_id, r.rating, r.comment, r.created_at, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       ORDER BY r.created_at DESC 
       LIMIT 30`
    );

    const reviews = result.rows;

    // Resolve movie details for each review to display the movie titles/posters in the Community page
    const movieIds = [...new Set(reviews.map(r => r.movie_id))];
    const movies = await movieService.getMultipleByIds(movieIds);
    const movieMap = {};
    movies.forEach(m => {
      movieMap[m.id] = m;
    });

    const enrichedReviews = reviews.map(r => ({
      ...r,
      movie: movieMap[r.movie_id] || { id: r.movie_id, title: 'Filme Desconhecido' }
    }));

    return res.json(enrichedReviews);
  } catch (error) {
    console.error('[Review Controller] getCommunityFeed Error:', error.message);
    return res.status(500).json({ message: 'Erro ao carregar feed da comunidade.' });
  }
};

exports.getStats = async (req, res) => {
  const userId = req.user.id;
  try {
    const favCountResult = await db.query('SELECT COUNT(*) FROM favorites WHERE user_id = $1', [userId]);
    const revCountResult = await db.query('SELECT COUNT(*) FROM reviews WHERE user_id = $1', [userId]);

    return res.json({
      favoritesCount: parseInt(favCountResult.rows[0].count, 10),
      reviewsCount: parseInt(revCountResult.rows[0].count, 10)
    });
  } catch (error) {
    console.error('[Review Controller] getStats Error:', error.message);
    return res.status(500).json({ message: 'Erro ao obter estatísticas do perfil.' });
  }
};

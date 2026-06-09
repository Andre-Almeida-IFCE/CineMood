const db = require('../database/db');
const movieService = require('../services/movieService');

exports.list = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT movie_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const movieIds = result.rows.map(row => row.movie_id);
    const movies = await movieService.getMultipleByIds(movieIds);

    return res.json(movies);
  } catch (error) {
    console.error('[Favorite Controller] list Error:', error.message);
    return res.status(500).json({ message: 'Erro ao listar filmes favoritos.' });
  }
};

exports.add = async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({ message: 'O ID do filme (movieId) é obrigatório.' });
  }

  try {
    await db.query(
      'INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) ON CONFLICT (user_id, movie_id) DO NOTHING',
      [userId, parseInt(movieId, 10)]
    );

    return res.status(201).json({ message: 'Filme adicionado aos favoritos com sucesso.' });
  } catch (error) {
    console.error('[Favorite Controller] add Error:', error.message);
    return res.status(500).json({ message: 'Erro ao favoritar filme.' });
  }
};

exports.remove = async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.params;

  try {
    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2',
      [userId, parseInt(movieId, 10)]
    );

    return res.json({ message: 'Filme removido dos favoritos com sucesso.' });
  } catch (error) {
    console.error('[Favorite Controller] remove Error:', error.message);
    return res.status(500).json({ message: 'Erro ao remover filme dos favoritos.' });
  }
};

exports.getCommunityFavorites = async (req, res) => {
  try {
    // Get popular movie IDs from favorites table in database
    const result = await db.query(
      'SELECT movie_id, COUNT(*) as count FROM favorites GROUP BY movie_id ORDER BY count DESC LIMIT 10'
    );

    const movieIds = result.rows.map(row => row.movie_id);
    let movies = [];
    
    if (movieIds.length > 0) {
      movies = await movieService.getMultipleByIds(movieIds);
    }

    // Fallback if there are no favorites in the system yet
    if (movies.length === 0) {
      // Return top 4 popular movies from our mock list
      const allMovies = await movieService.getTrending();
      movies = allMovies.slice(0, 5);
    }

    return res.json(movies);
  } catch (error) {
    console.error('[Favorite Controller] getCommunityFavorites Error:', error.message);
    return res.status(500).json({ message: 'Erro ao buscar favoritos da comunidade.' });
  }
};

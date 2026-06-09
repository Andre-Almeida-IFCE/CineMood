const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let useMockDb = false;

// In-Memory Mock Database Store
const mockDb = {
  users: [],
  favorites: [],
  reviews: [],
  userIdSeq: 1,
  favoriteIdSeq: 1,
  reviewIdSeq: 1
};

// Check if database configuration is present
const hasDbConfig = !!(process.env.DATABASE_URL || (process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE));

if (hasDbConfig) {
  console.log('[CineMood DB] PostgreSQL configuration found. Attempting connection...');
  try {
    const poolConfig = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.DATABASE_URL.includes('supabase') || process.env.DB_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false
        }
      : {
          user: process.env.PGUSER,
          host: process.env.PGHOST || 'localhost',
          database: process.env.PGDATABASE,
          password: process.env.PGPASSWORD,
          port: process.env.PGPORT || 5432,
        };

    pool = new Pool(poolConfig);

    // Test connection
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('[CineMood DB] PostgreSQL connection test failed:', err.message);
        console.warn('[CineMood DB] Falling back to IN-MEMORY Mock Database!');
        useMockDb = true;
      } else {
        console.log('[CineMood DB] PostgreSQL Connected successfully at:', res.rows[0].now);
      }
    });
  } catch (err) {
    console.error('[CineMood DB] Failed to initialize PostgreSQL pool:', err.message);
    console.warn('[CineMood DB] Falling back to IN-MEMORY Mock Database!');
    useMockDb = true;
  }
} else {
  console.warn('[CineMood DB] No PostgreSQL credentials found in environment variables.');
  console.warn('[CineMood DB] Running in IN-MEMORY Mock Database mode.');
  useMockDb = true;
}

// In-memory query parser to simulate PostgreSQL behavior for standard CineMood queries
function runMockQuery(text, params = []) {
  const normalized = text.replace(/\s+/g, ' ').trim().toLowerCase();

  // 1. Create User: INSERT INTO users
  if (normalized.includes('insert into users')) {
    // INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *
    const [name, email, passwordHash] = params;
    
    // Check unique email
    const existing = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('duplicate key value violates unique constraint "users_email_key"');
      err.code = '23505';
      throw err;
    }

    const newUser = {
      id: mockDb.userIdSeq++,
      name,
      email,
      password_hash: passwordHash,
      created_at: new Date()
    };
    mockDb.users.push(newUser);
    return { rows: [newUser] };
  }

  // 2. Select User by Email
  if (normalized.includes('select * from users where email =')) {
    const email = params[0];
    const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return { rows: user ? [user] : [] };
  }

  // 3. Select User by ID
  if (normalized.includes('select * from users where id =')) {
    const id = parseInt(params[0], 10);
    const user = mockDb.users.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }

  // 4. Get User Favorites
  if (normalized.includes('select * from favorites where user_id =')) {
    const userId = parseInt(params[0], 10);
    const userFavs = mockDb.favorites.filter(f => f.user_id === userId);
    return { rows: userFavs };
  }

  // 5. Add Favorite: INSERT INTO favorites
  if (normalized.includes('insert into favorites')) {
    // INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *
    const userId = parseInt(params[0], 10);
    const movieId = parseInt(params[1], 10);

    const exists = mockDb.favorites.find(f => f.user_id === userId && f.movie_id === movieId);
    if (exists) {
      return { rows: [exists] }; // Already favorited
    }

    const newFav = {
      id: mockDb.favoriteIdSeq++,
      user_id: userId,
      movie_id: movieId,
      created_at: new Date()
    };
    mockDb.favorites.push(newFav);
    return { rows: [newFav] };
  }

  // 6. Delete Favorite: DELETE FROM favorites
  if (normalized.includes('delete from favorites')) {
    // DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2
    const userId = parseInt(params[0], 10);
    const movieId = parseInt(params[1], 10);
    const initialLen = mockDb.favorites.length;
    mockDb.favorites = mockDb.favorites.filter(f => !(f.user_id === userId && f.movie_id === movieId));
    return { rowCount: initialLen - mockDb.favorites.length };
  }

  // 7. Get Reviews for specific Movie
  if (normalized.includes('reviews r join users u') && normalized.includes('r.movie_id =')) {
    // SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = $1 ORDER BY r.created_at DESC
    const movieId = parseInt(params[0], 10);
    const movieReviews = mockDb.reviews
      .filter(r => r.movie_id === movieId)
      .map(r => {
        const user = mockDb.users.find(u => u.id === r.user_id);
        return {
          ...r,
          user_name: user ? user.name : 'Unknown User'
        };
      })
      .sort((a, b) => b.created_at - a.created_at);
    return { rows: movieReviews };
  }

  // 8. Get All Reviews (Community Feed)
  if (normalized.includes('reviews r join users u') && !normalized.includes('r.movie_id =')) {
    // SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC
    const allReviews = mockDb.reviews
      .map(r => {
        const user = mockDb.users.find(u => u.id === r.user_id);
        return {
          ...r,
          user_name: user ? user.name : 'Unknown User'
        };
      })
      .sort((a, b) => b.created_at - a.created_at);
    return { rows: allReviews };
  }

  // 9. Create Review: INSERT INTO reviews
  if (normalized.includes('insert into reviews')) {
    // INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *
    const userId = parseInt(params[0], 10);
    const movieId = parseInt(params[1], 10);
    const rating = parseInt(params[2], 10);
    const comment = params[3];

    // Check if user already reviewed this movie - update if so, or add new
    const existingIndex = mockDb.reviews.findIndex(r => r.user_id === userId && r.movie_id === movieId);
    const newReview = {
      id: existingIndex !== -1 ? mockDb.reviews[existingIndex].id : mockDb.reviewIdSeq++,
      user_id: userId,
      movie_id: movieId,
      rating,
      comment,
      created_at: new Date()
    };

    if (existingIndex !== -1) {
      mockDb.reviews[existingIndex] = newReview;
    } else {
      mockDb.reviews.push(newReview);
    }

    return { rows: [newReview] };
  }

  // 10. Get User Statistics
  // e.g., COUNT of favorites and reviews for a user
  if (normalized.includes('select count(*) from favorites where user_id =')) {
    const userId = parseInt(params[0], 10);
    const count = mockDb.favorites.filter(f => f.user_id === userId).length;
    return { rows: [{ count: count.toString() }] };
  }

  if (normalized.includes('select count(*) from reviews where user_id =')) {
    const userId = parseInt(params[0], 10);
    const count = mockDb.reviews.filter(r => r.user_id === userId).length;
    return { rows: [{ count: count.toString() }] };
  }

  // 11. Community Favorites count query (to find popular movies)
  // SELECT movie_id, COUNT(*) as count FROM favorites GROUP BY movie_id ORDER BY count DESC LIMIT $1
  if (normalized.includes('select movie_id, count(*)') && normalized.includes('group by movie_id')) {
    const limit = params[0] || 10;
    const counts = {};
    mockDb.favorites.forEach(f => {
      counts[f.movie_id] = (counts[f.movie_id] || 0) + 1;
    });
    const sorted = Object.keys(counts)
      .map(mid => ({ movie_id: parseInt(mid, 10), count: counts[mid] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    return { rows: sorted };
  }

  throw new Error(`Unsupported mock SQL query: ${text}`);
}

module.exports = {
  query: async (text, params) => {
    if (useMockDb) {
      return runMockQuery(text, params);
    }
    try {
      return await pool.query(text, params);
    } catch (err) {
      // If pool queries fail mid-run due to DB disconnect, log and throw
      console.error('[CineMood DB] PostgreSQL query error:', err.message);
      throw err;
    }
  },
  isMock: () => useMockDb
};

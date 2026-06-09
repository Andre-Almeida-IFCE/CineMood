const axios = require('axios');

// TMDB Genre Maps:
// 28: Ação, 12: Aventura, 16: Animação, 35: Comédia, 80: Crime, 99: Documentário, 18: Drama, 10751: Família,
// 14: Fantasia, 36: História, 27: Terror, 10402: Música, 9648: Mistério, 10749: Romance, 878: Ficção Científica,
// 10770: Cinema TV, 53: Suspense, 10752: Guerra, 37: Faroeste
const GENRE_MAP = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime',
  99: 'Documentário', 18: 'Drama', 10751: 'Família', 14: 'Fantasia',
  36: 'História', 27: 'Terror', 10402: 'Música', 9648: 'Mistério',
  10749: 'Romance', 878: 'Ficção Científica', 53: 'Suspense',
  10752: 'Guerra', 37: 'Faroeste'
};

// Mock Movies database (loaded with real TMDB poster and backdrop IDs)
const MOCK_MOVIES = [
  {
    id: 278,
    title: 'Um Sonho de Liberdade',
    original_title: 'The Shawshank Redemption',
    overview: 'Dois homens presos se reúnem ao longo de vários anos, encontrando consolo e eventual redenção através de atos de decência comum.',
    poster_path: '/lycl90u7nR704n4CQg79bgrUper.jpg',
    backdrop_path: '/kXfqK2UBxAgziy2zR6OI765t6wB.jpg',
    vote_average: 8.7,
    genre_ids: [18, 80],
    genres: ['Drama', 'Crime'],
    release_date: '1994-09-23',
    popularity: 135.2
  },
  {
    id: 157336,
    title: 'Interestelar',
    original_title: 'Interstellar',
    overview: 'As reservas naturais da Terra estão se esgotando e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial.',
    poster_path: '/gEU2QvHOm5geW8j3tH6E4dfZ12N.jpg',
    backdrop_path: '/xJHokZbljvjC4nQ61Iczo86JmSt.jpg',
    vote_average: 8.4,
    genre_ids: [878, 12, 18],
    genres: ['Ficção Científica', 'Aventura', 'Drama'],
    release_date: '2014-11-05',
    popularity: 152.4
  },
  {
    id: 27205,
    title: 'A Origem',
    original_title: 'Inception',
    overview: 'Dom Cobb é um ladrão habilidoso, o melhor na arte perigosa da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sono.',
    poster_path: '/edv5CZv0jA95svO6mwCLzTTI8Cc.jpg',
    backdrop_path: '/s3TBrRGB1K77G2k5mlv9t1Y1P6c.jpg',
    vote_average: 8.3,
    genre_ids: [878, 28, 12, 53],
    genres: ['Ficção Científica', 'Ação', 'Aventura', 'Suspense'],
    release_date: '2010-07-15',
    popularity: 112.5
  },
  {
    id: 120,
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    original_title: 'The Lord of the Rings: The Fellowship of the Ring',
    overview: 'Um jovem hobbit, pressionado a destruir um anel mágico, inicia uma jornada épica até a Montanha da Perdição para derrotar o Senhor do Escuro.',
    poster_path: '/6oom5Q426Ym6jTz866FMw4B1EXy.jpg',
    backdrop_path: '/5NzEq77RhIlx4vI5Sj1x19W34sl.jpg',
    vote_average: 8.4,
    genre_ids: [12, 14, 28],
    genres: ['Aventura', 'Fantasia', 'Ação'],
    release_date: '2001-12-18',
    popularity: 145.8
  },
  {
    id: 129,
    title: 'A Viagem de Chihiro',
    original_title: 'Spirited Away',
    overview: 'Chihiro, uma menina de 10 anos, descobre um mundo secreto habitado por deuses, bruxas e espíritos, onde os humanos são transformados em bestas.',
    poster_path: '/3937Ger2M1SUCtmPhXC4qZs7JjB.jpg',
    backdrop_path: '/Ab8tZp75122w0601uQ5Lx09pfjj.jpg',
    vote_average: 8.5,
    genre_ids: [16, 14, 10751],
    genres: ['Animação', 'Fantasia', 'Família'],
    release_date: '2001-07-20',
    popularity: 98.6
  },
  {
    id: 11324,
    title: 'Ilha do Medo',
    original_title: 'Shutter Island',
    overview: 'Em 1954, o xerife Teddy Daniels investiga o desaparecimento de uma assassina que escapou de um hospital psiquiátrico localizado em uma ilha isolada.',
    poster_path: '/42me2v1cn2UNx6rfw7sb07xF74I.jpg',
    backdrop_path: '/w5n1a6v18A4c02jX2m4Q47yWjQp.jpg',
    vote_average: 8.2,
    genre_ids: [9648, 53, 18],
    genres: ['Mistério', 'Suspense', 'Drama'],
    release_date: '2010-02-14',
    popularity: 92.4
  },
  {
    id: 807,
    title: 'Se7en: Os Sete Crimes Capitais',
    original_title: 'Se7en',
    overview: 'Dois detetives, um novato e outro prestes a se aposentar, caçam um assassino em série cujos crimes são baseados nos sete pecados capitais.',
    poster_path: '/69CzZBMWn61xpOU2j4666SSm59e.jpg',
    backdrop_path: '/Z52f36W2e77j59zZ1XWc18G2q8.jpg',
    vote_average: 8.3,
    genre_ids: [80, 9648, 53],
    genres: ['Crime', 'Mistério', 'Suspense'],
    release_date: '1995-09-22',
    popularity: 85.3
  },
  {
    id: 19466,
    title: 'Se Beber, Não Case!',
    original_title: 'The Hangover',
    overview: 'Três amigos acordam em Las Vegas sem nenhuma memória da despedida de solteiro do amigo no dia anterior e percebem que o noivo sumiu.',
    poster_path: '/ulJ6Qn05VspWgd59SRnLIy19lOi.jpg',
    backdrop_path: '/d5Xy2741vYpX8s8g9o6x7D57q8N.jpg',
    vote_average: 7.3,
    genre_ids: [35],
    genres: ['Comédia'],
    release_date: '2009-06-02',
    popularity: 78.4
  },
  {
    id: 597,
    title: 'Titanic',
    original_title: 'Titanic',
    overview: 'Uma aristocrata de dezessete anos se apaixona por um artista gentil, mas pobre, a bordo do luxuoso e malfadado R.M.S. Titanic.',
    poster_path: '/9xfWh2n6O4n62eD9iE17e9vM70y.jpg',
    backdrop_path: '/6Km4R5B27n23v34W8Xwz1eL8Y6d.jpg',
    vote_average: 7.9,
    genre_ids: [18, 10749],
    genres: ['Drama', 'Romance'],
    release_date: '1997-11-18',
    popularity: 110.2
  },
  {
    id: 496243,
    title: 'Parasita',
    original_title: 'Parasite',
    overview: 'Toda a família de Ki-taek está desempregada, vivendo num porão sujo. Por obra do acaso, o filho adolescente começa a dar aulas de inglês à filha de uma família rica.',
    poster_path: '/7c96lR7bb7B4V7qgm1oCXqbuWn2.jpg',
    backdrop_path: '/dV3gLg9642j3cW9Ww1V86P482zC.jpg',
    vote_average: 8.5,
    genre_ids: [35, 53, 18],
    genres: ['Comédia', 'Suspense', 'Drama'],
    release_date: '2019-05-30',
    popularity: 88.6
  },
  {
    id: 228150,
    title: 'Operação Big Hero',
    original_title: 'Big Hero 6',
    overview: 'O prodígio da robótica Hiro Hamada se vê envolvido em uma conspiração criminosa e transforma seu robô inflável de cuidados de saúde, Baymax, em um super-herói.',
    poster_path: '/9lM0bQ6C2Yw9P00uV36yV9T8u8e.jpg',
    backdrop_path: '/3Ii72A3C1U1W0142r152X3V6yT8e.jpg',
    vote_average: 7.8,
    genre_ids: [16, 10751, 12, 35, 878],
    genres: ['Animação', 'Família', 'Aventura', 'Comédia', 'Ficção Científica'],
    release_date: '2014-10-24',
    popularity: 65.2
  },
  {
    id: 155,
    title: 'Batman: O Cavaleiro das Trevas',
    original_title: 'The Dark Knight',
    overview: 'Com a ajuda de Jim Gordon e Harvey Dent, Batman mantém a ordem em Gotham até que um jovem e brilhante criminoso, o Coringa, instaura o caos.',
    poster_path: '/qJ2tWGB286tXIHyYWn3ov8AOw69.jpg',
    backdrop_path: '/nMKdUU7JGWwflgwbzwFYHp59XyA.jpg',
    vote_average: 8.5,
    genre_ids: [28, 80, 18, 53],
    genres: ['Ação', 'Crime', 'Drama', 'Suspense'],
    release_date: '2008-07-16',
    popularity: 124.7
  },
  {
    id: 603,
    title: 'Matrix',
    original_title: 'The Matrix',
    overview: 'Um programador de computador descobre que a realidade em que vive é uma simulação criada por máquinas inteligentes e se junta a uma rebelião para libertar a humanidade.',
    poster_path: '/f89U3wz6v26K7SVLI3tT4NuY9e0.jpg',
    backdrop_path: '/o0p7102eH45WzV23R6Oi8746ySt.jpg',
    vote_average: 8.2,
    genre_ids: [878, 28],
    genres: ['Ficção Científica', 'Ação'],
    release_date: '1999-03-30',
    popularity: 90.3
  },
  {
    id: 13,
    title: 'Forrest Gump: O Contador de Histórias',
    original_title: 'Forrest Gump',
    overview: 'A vida de um homem simples do Alabama com QI baixo se cruza com momentos históricos icônicos da segunda metade do século XX nos Estados Unidos.',
    poster_path: '/w86675nvw601wOU2j4666SSm59e.jpg',
    backdrop_path: '/3h1JZaxccwflgwbzwFYHp59XyA.jpg',
    vote_average: 8.5,
    genre_ids: [35, 18, 10749],
    genres: ['Comédia', 'Drama', 'Romance'],
    release_date: '1994-06-23',
    popularity: 115.6
  },
  {
    id: 259316,
    title: 'Divertida Mente',
    original_title: 'Inside Out',
    overview: 'Crescer pode ser uma jornada turbulenta, e com a jovem Riley não é diferente. Suas emoções - Alegria, Medo, Raiva, Nojo e Tristeza - vivem na Central de Controle da sua mente.',
    poster_path: '/lRGE8839UjZT5vKFuiZgTyFdZ2d.jpg',
    backdrop_path: '/j29Zue48Xwz1eL8Y6dSt.jpg',
    vote_average: 8.0,
    genre_ids: [16, 10751, 35, 12],
    genres: ['Animação', 'Família', 'Comédia', 'Aventura'],
    release_date: '2015-06-09',
    popularity: 84.1
  },
  {
    id: 313369,
    title: 'La La Land: Cantando Estações',
    original_title: 'La La Land',
    overview: 'Ao chegar em Los Angeles, o pianista de jazz Sebastian conhece a atriz iniciante Mia e os dois se apaixonam perdidamente enquanto buscam o sucesso profissional.',
    poster_path: '/ylXCdC122vJu86G200gPk751V79.jpg',
    backdrop_path: '/yOmC4R5B27n23v34W8Xwz1eL8Y6d.jpg',
    vote_average: 7.9,
    genre_ids: [18, 10749, 10402],
    genres: ['Drama', 'Romance', 'Música'],
    release_date: '2016-11-29',
    popularity: 76.5
  },
  {
    id: 389,
    title: '12 Homens e uma Sentença',
    original_title: '12 Angry Men',
    overview: 'Um jurado dissidente tenta evitar um erro judicial forçando seus colegas a reexaminarem as evidências em um julgamento por assassinato.',
    poster_path: '/pp4U3wz6v26K7SVLI3tT4NuY9e0.jpg',
    backdrop_path: '/lXfqK2UBxAgziy2zR6OI765t6wB.jpg',
    vote_average: 8.5,
    genre_ids: [18],
    genres: ['Drama'],
    release_date: '1957-04-10',
    popularity: 58.6
  },
  {
    id: 550,
    title: 'Clube da Luta',
    original_title: 'Fight Club',
    overview: 'Um homem deprimido que sofre de insônia conhece um vendedor estranho de sabonetes chamado Tyler Durden e logo se encontra morando com ele e iniciando um clube secreto.',
    poster_path: '/pB8BM76G6j0hH6w0N36mqRxyzJc.jpg',
    backdrop_path: '/rr7E0qi91YpX8s8g9o6x7D57q8N.jpg',
    vote_average: 8.4,
    genre_ids: [18, 53, 28],
    genres: ['Drama', 'Suspense', 'Ação'],
    release_date: '1999-10-15',
    popularity: 104.3
  },
  {
    id: 680,
    title: 'Pulp Fiction: Tempo de Violência',
    original_title: 'Pulp Fiction',
    overview: 'As vidas de dois assassinos da máfia, um boxeador, a esposa de um gângster e um par de bandidos se cruzam em quatro histórias de violência e redenção.',
    poster_path: '/d5i2fMNI06js3CYGNuJ0FGvUNWK.jpg',
    backdrop_path: '/nMKdUU7JGWwflgwbzwFYHp59XyA.jpg',
    vote_average: 8.5,
    genre_ids: [53, 80],
    genres: ['Suspense', 'Crime'],
    release_date: '1994-09-10',
    popularity: 118.2
  },
  {
    id: 282631,
    title: 'O Regresso',
    original_title: 'The Revenant',
    overview: 'Em 1823, o caçador Hugh Glass luta pela sobrevivência na floresta selvagem americana depois de ser atacado por um urso pardo e ser abandonado à morte pelos companheiros.',
    poster_path: '/c501o4u41a8v2t7u671H2wI406.jpg',
    backdrop_path: '/rr7E0qi91YpX8s8g9o6x7D57q8N.jpg',
    vote_average: 7.5,
    genre_ids: [37, 18, 12, 53],
    genres: ['Faroeste', 'Drama', 'Aventura', 'Suspense'],
    release_date: '2015-12-25',
    popularity: 68.2
  }
];

// Helper to filter/map TMDB response into a unified format
function formatTmdbMovie(m) {
  const genres = m.genre_ids ? m.genre_ids.map(id => GENRE_MAP[id] || 'Outros').filter(Boolean) : [];
  return {
    id: m.id,
    title: m.title || m.name,
    original_title: m.original_title || m.original_name,
    overview: m.overview || 'Nenhuma sinopse disponível.',
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    vote_average: parseFloat((m.vote_average || 0).toFixed(1)),
    genre_ids: m.genre_ids || [],
    genres: genres,
    release_date: m.release_date || m.first_air_date || 'N/A',
    popularity: m.popularity || 0
  };
}

// 1. Get Trending Movies
exports.getTrending = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    // Sort mock movies by popularity descending
    return [...MOCK_MOVIES].sort((a, b) => b.popularity - a.popularity);
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=pt-BR`
    );
    return response.data.results.map(formatTmdbMovie);
  } catch (error) {
    console.error('[Movie Service] TMDB trending error, returning mock data:', error.message);
    return [...MOCK_MOVIES].sort((a, b) => b.popularity - a.popularity);
  }
};

// 2. Search Movies by title/genre/keyword
exports.searchMovies = async (query) => {
  if (!query || query.trim() === '') return [];

  const apiKey = process.env.TMDB_API_KEY;
  const qClean = query.trim().toLowerCase();

  if (!apiKey) {
    // In mock mode, check title, original title, synopsis, or genre name
    return MOCK_MOVIES.filter(m => {
      const matchTitle = m.title.toLowerCase().includes(qClean) || m.original_title.toLowerCase().includes(qClean);
      const matchOverview = m.overview.toLowerCase().includes(qClean);
      const matchGenre = m.genres.some(g => g.toLowerCase().includes(qClean));
      return matchTitle || matchOverview || matchGenre;
    });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`
    );
    return response.data.results.map(formatTmdbMovie);
  } catch (error) {
    console.error('[Movie Service] TMDB search error, falling back to mock search:', error.message);
    return MOCK_MOVIES.filter(m => {
      const matchTitle = m.title.toLowerCase().includes(qClean) || m.original_title.toLowerCase().includes(qClean);
      const matchGenre = m.genres.some(g => g.toLowerCase().includes(qClean));
      return matchTitle || matchGenre;
    });
  }
};

// 3. Get Specific Movie Details
exports.getMovieDetails = async (id) => {
  const numId = parseInt(id, 10);
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    const found = MOCK_MOVIES.find(m => m.id === numId);
    if (!found) throw new Error('Filme não encontrado na base local.');
    return found;
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${numId}?api_key=${apiKey}&language=pt-BR`
    );
    const m = response.data;
    
    // Format details
    return {
      id: m.id,
      title: m.title,
      original_title: m.original_title,
      overview: m.overview || 'Nenhuma sinopse disponível.',
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      vote_average: parseFloat((m.vote_average || 0).toFixed(1)),
      genre_ids: m.genres ? m.genres.map(g => g.id) : [],
      genres: m.genres ? m.genres.map(g => g.name) : [],
      release_date: m.release_date || 'N/A',
      popularity: m.popularity || 0
    };
  } catch (error) {
    console.error(`[Movie Service] TMDB getMovieDetails error for id ${numId}, checking local database:`, error.message);
    const found = MOCK_MOVIES.find(m => m.id === numId);
    if (!found) throw new Error(`Filme ID ${numId} não encontrado no TMDB nem na base local.`);
    return found;
  }
};

// 4. Me Surpreenda (Surprise Me - Random Movie)
exports.getRandomMovie = async () => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    const randomIndex = Math.floor(Math.random() * MOCK_MOVIES.length);
    return MOCK_MOVIES[randomIndex];
  }

  try {
    // Fetch popular movies page 1 and select a random item
    const page = Math.floor(Math.random() * 5) + 1; // get from first 5 pages for good quality
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`
    );
    const results = response.data.results;
    if (results && results.length > 0) {
      const randomIndex = Math.floor(Math.random() * results.length);
      return formatTmdbMovie(results[randomIndex]);
    }
    throw new Error('Sem resultados de filmes populares.');
  } catch (error) {
    console.error('[Movie Service] Random movie error, falling back to mock database:', error.message);
    const randomIndex = Math.floor(Math.random() * MOCK_MOVIES.length);
    return MOCK_MOVIES[randomIndex];
  }
};

// 5. Get recommended movies based on weather and user's mood
exports.getRecommended = async (weatherCondition, mood) => {
  // Map weather to genre IDs
  // Chuva -> Drama (18), Mistério (9648), Suspense (53)
  // Ensolarado -> Comédia (35), Aventura (12), Família (10751)
  // Frio -> Ficção Científica (878), Fantasia (14), Terror (27)
  // Nublado/Outro -> Ação (28), Animação (16), Crime (80)
  let weatherGenres = [];
  if (weatherCondition === 'Chuva') {
    weatherGenres = [18, 9648, 53];
  } else if (weatherCondition === 'Ensolarado') {
    weatherGenres = [35, 12, 10751];
  } else if (weatherCondition === 'Frio') {
    weatherGenres = [878, 14, 27];
  } else {
    weatherGenres = [28, 16, 80];
  }

  // Map mood to genre IDs
  // Feliz -> Comédia (35), Romance (10749), Família (10751)
  // Triste -> Drama (18), Romance (10749) (cozy/healing)
  // Ansioso -> Animação (16), Comédia (35), Fantasia (14) (comforting)
  // Entediado -> Ação (28), Aventura (12), Suspense (53) (adrenaline)
  // Cansado -> Documentário (99), Família (10751) (low effort)
  let moodGenres = [];
  if (mood === 'Feliz') {
    moodGenres = [35, 10749, 10751];
  } else if (mood === 'Triste') {
    moodGenres = [18, 10749];
  } else if (mood === 'Ansioso') {
    moodGenres = [16, 35, 14];
  } else if (mood === 'Entediado') {
    moodGenres = [28, 12, 53];
  } else if (mood === 'Cansado') {
    moodGenres = [99, 10751];
  } else {
    // Default mood: relaxed/curious
    moodGenres = [12, 878, 35];
  }

  // Combine both sets. We'll prioritize movies that match either or both criteria.
  const combinedGenreIds = [...new Set([...weatherGenres, ...moodGenres])];

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    // Filter mock database. Find movies matching combined genre IDs.
    // Score them: 2 points for weather match, 2 points for mood match.
    const scored = MOCK_MOVIES.map(m => {
      let score = 0;
      m.genre_ids.forEach(gid => {
        if (weatherGenres.includes(gid)) score += 2;
        if (moodGenres.includes(gid)) score += 2;
      });
      return { movie: m, score };
    });

    // Return sorted by score, then popularity
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || b.movie.popularity - a.movie.popularity)
      .map(item => item.movie);
  }

  try {
    // Query TMDB using discover/movie with matching genres
    // To get a diverse list, we query with the main genre and some random combination
    const primaryGenre = weatherGenres[0];
    const secondaryGenre = moodGenres[0];
    
    // Call TMDB discover endpoint
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${primaryGenre},${secondaryGenre}&sort_by=popularity.desc&language=pt-BR`
    );
    let results = response.data.results;

    // If result set is too small, relax constraint to match any of the combined genres
    if (!results || results.length < 5) {
      const fallbackResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${combinedGenreIds.join('|')}&sort_by=popularity.desc&language=pt-BR`
      );
      results = fallbackResponse.data.results;
    }

    return results.map(formatTmdbMovie);
  } catch (error) {
    console.error('[Movie Service] Discover failed, falling back to local scoring:', error.message);
    const scored = MOCK_MOVIES.map(m => {
      let score = 0;
      m.genre_ids.forEach(gid => {
        if (weatherGenres.includes(gid)) score += 2;
        if (moodGenres.includes(gid)) score += 2;
      });
      return { movie: m, score };
    });
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || b.movie.popularity - a.movie.popularity)
      .map(item => item.movie);
  }
};

// 6. Get Multiple Movies by IDs (for favorites list, etc.)
exports.getMultipleByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  
  // Resolve all details in parallel
  const promises = ids.map(id => 
    exports.getMovieDetails(id).catch(err => {
      console.warn(`[Movie Service] Could not fetch details for ID ${id}:`, err.message);
      return null;
    })
  );

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

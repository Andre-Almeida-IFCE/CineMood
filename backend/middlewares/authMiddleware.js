const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token inválido ou mal formatado.' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cinemood_jwt_secret_token_998124');
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirado ou inválido.' });
  }
};

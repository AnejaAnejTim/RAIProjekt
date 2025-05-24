const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

module.exports = function (req, res, next) {
  console.log('requireAuth middleware invoked');

  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization header missing or malformed');
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token:', decoded);

    // Attach user info from token to request object
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Token expired:', err);
      return res.status(401).json({ error: 'Token expired' });
    } else {
      console.log('JWT verification error:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};

// middleware/auth.middleware.js
const { verify } = require('../utils/jwt');
const db = require('../models');

module.exports.authenticateToken = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const payload = verify(token); // throws if invalid
    // payload: { id, role, iat, exp }
    req.identity = { id: payload.id, role: payload.role };

    // Attach model instance (full record) to req.identity.model if needed
    if (payload.role === 'farmer') {
      req.identity.model = await db.Farmers.findByPk(payload.id);
    } else if (payload.role === 'buyer') {
      req.identity.model = await db.Buyers.findByPk(payload.id);
    } else {
      req.identity.model = null;
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

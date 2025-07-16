const axios = require('axios');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing token, please log in' });

  const token = authHeader.split(' ')[1];

  try {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    req.user = response.data; // Contains user info like email, name, etc.
    next();
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
}

module.exports = authenticateToken;

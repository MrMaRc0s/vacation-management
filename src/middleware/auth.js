const jwt = require('jsonwebtoken');
const SECRET = 'supersecurekey';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.writeHead(401);
    return res.end(JSON.stringify({ error: 'No token provided' }));
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.writeHead(403);
      return res.end(JSON.stringify({ error: 'Invalid or expired token' }));
    }
    req.user = decoded;
    next();
  });
};

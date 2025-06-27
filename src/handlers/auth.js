const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');
const jwt = require('jsonwebtoken');
const SECRET = 'supersecurekey'; // this should be in .env but for simplicity, it's hardcoded here

exports.handleLogin = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { username, password } = JSON.parse(body);

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (!user) {
        res.writeHead(401);
        return res.end(JSON.stringify({ error: "Invalid credentials" }));
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          res.writeHead(401);
          return res.end(JSON.stringify({ error: "Wrong password" }));
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token, role: user.role }));
      });
    });
  });
};


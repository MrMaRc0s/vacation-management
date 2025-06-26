const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

exports.handleLogin = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { username, password } = JSON.parse(body);

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (!user) {
        res.writeHead(401);
        return res.end("Invalid login");
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ userId: user.id, role: user.role }));
        } else {
          res.writeHead(401);
          res.end("Invalid credentials");
        }
      });
    });
  });
};

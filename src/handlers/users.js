const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('db.sqlite');

exports.getUsers = (req, res) => {
  db.all("SELECT id, username, email, employee_code, role FROM users", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      return res.end("Database error");
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  });
};

exports.createUser = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { username, email, password, role, employee_code } = JSON.parse(body);
    const id = uuidv4();

    bcrypt.hash(password, 10, (err, hash) => {
      db.run(
        "INSERT INTO users (id, username, email, password, role, employee_code) VALUES (?, ?, ?, ?, ?, ?)",
        [id, username, email, hash, role, employee_code],
        function (err) {
          if (err) {
            res.writeHead(500);
            return res.end("Failed to create user");
          }

          res.writeHead(201);
          res.end("User created");
        }
      );
    });
  });
};

exports.updateUser = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { id, username, email, password } = JSON.parse(body);

    const update = (hash = null) => {
      const sql = hash
        ? "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?"
        : "UPDATE users SET username = ?, email = ? WHERE id = ?";
      const params = hash ? [username, email, hash, id] : [username, email, id];

      db.run(sql, params, function (err) {
        if (err) {
          res.writeHead(500);
          return res.end("Failed to update user");
        }

        res.writeHead(200);
        res.end("User updated");
      });
    };

    if (password) {
      bcrypt.hash(password, 10, (err, hash) => update(hash));
    } else {
      update();
    }
  });
};

exports.deleteUser = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { id } = JSON.parse(body);

    db.run("DELETE FROM vacation_requests WHERE user_id = ?", [id], () => {
      db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
          res.writeHead(500);
          return res.end("Failed to delete user");
        }

        res.writeHead(200);
        res.end("User deleted");
      });
    });
  });
};

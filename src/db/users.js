const db = require('./db');

exports.getAllUsers = async () => {
  return db.allAsync("SELECT id, username, email, role, employee_code FROM users");
};

exports.getUserByUsername = async (username) => {
  return db.getAsync("SELECT * FROM users WHERE username = ?", [username]);
};

exports.getUserByUsernameOrEmail = async (username, email) => {
  return db.getAsync(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
};

exports.createUser = async ({ id, username, email, password, role, employee_code }) => {
  return db.runAsync(
    "INSERT INTO users (id, username, email, password, role, employee_code) VALUES (?, ?, ?, ?, ?, ?)",
    [id, username, email, password, role, employee_code]
  );
};

exports.updateUser = async ({ id, username, email, password }) => {
  if (password) {
    return db.runAsync(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, password, id]
    );
  } else {
    return db.runAsync(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, id]
    );
  }
};

exports.deleteUser = async (id) => {
  await db.runAsync("DELETE FROM vacation_requests WHERE user_id = ?", [id]);
  return db.runAsync("DELETE FROM users WHERE id = ?", [id]);
};

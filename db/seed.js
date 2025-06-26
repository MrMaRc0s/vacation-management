const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./db.sqlite');

const seed = async () => {
  const saltRounds = 10;
  const managerpass = await bcrypt.hash("managerpass", saltRounds);
  const employeepass = await bcrypt.hash("employeepass", saltRounds);

  const managerId = uuidv4();
  const employeeId = uuidv4();

  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS vacation_requests");
    db.run("DROP TABLE IF EXISTS users");

    db.run(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        employee_code TEXT
      )
    `);

    db.run(`
      CREATE TABLE vacation_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        start_date TEXT,
        end_date TEXT,
        reason TEXT,
        status TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(
      `INSERT INTO users (id, username, email, password, role, employee_code)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [managerId, "AliceManager", "alice@company.com", managerpass, "manager", "1234567"]
    );

    db.run(
      `INSERT INTO users (id, username, email, password, role, employee_code)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employeeId, "BobEmployee", "bob@company.com", employeepass, "employee", "2345678"]
    );

    db.run(
      `INSERT INTO vacation_requests (id, user_id, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), employeeId, "2025-07-01", "2025-07-10", "Family trip", "pending"]
    );

    console.log("Seeded demo data.");
    db.close();
  });
};

seed();


// To run this script, use the command: node db/seed.js
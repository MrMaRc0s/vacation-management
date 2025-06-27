CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    employee_code TEXT
);

CREATE TABLE vacation_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    submit_date TEXT,
    start_date TEXT,
    end_date TEXT,
    reason TEXT,
    status TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

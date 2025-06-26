CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'manager' or 'employee'
    employee_code TEXT
);

CREATE TABLE vacation_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    start_date TEXT,
    end_date TEXT,
    reason TEXT,
    status TEXT, -- 'pending', 'approved', 'rejected'
    FOREIGN KEY (user_id) REFERENCES users(id)
);

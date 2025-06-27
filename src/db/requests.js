const db = require('./db');

exports.getRequestsByUser = async (user_id) => {
  return db.allAsync(
    `SELECT vacation_requests.*, users.username
     FROM vacation_requests
     JOIN users ON vacation_requests.user_id = users.id
     WHERE user_id = ?`,
    [user_id]
  );
};

exports.getAllRequests = async () => {
  return db.allAsync(
    `SELECT vacation_requests.*, users.username
     FROM vacation_requests
     JOIN users ON vacation_requests.user_id = users.id`
  );
};

exports.createRequest = async ({ id, user_id, start_date, end_date, reason }) => {
  const submit_date = new Date().toISOString();
  return db.runAsync(
    `INSERT INTO vacation_requests (id, user_id, submit_date, start_date, end_date, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [id, user_id, submit_date, start_date, end_date, reason]
  );
};

exports.updateRequestStatus = async ({ id, status }) => {
  return db.runAsync(
    "UPDATE vacation_requests SET status = ? WHERE id = ?",
    [status, id]
  );
};

exports.deleteRequest = async (id) => {
  return db.runAsync("DELETE FROM vacation_requests WHERE id = ?", [id]);
};

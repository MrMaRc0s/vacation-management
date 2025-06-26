const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('db.sqlite');

exports.createRequest = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { user_id, start_date, end_date, reason } = JSON.parse(body);
    const id = uuidv4();

    db.run(
      "INSERT INTO vacation_requests (id, user_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [id, user_id, start_date, end_date, reason],
      function (err) {
        if (err) {
          res.writeHead(500);
          return res.end("Failed to create request");
        }

        res.writeHead(201);
        res.end("Request submitted");
      }
    );
  });
};

exports.getRequests = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { user_id, role } = JSON.parse(body);

    const query = role === 'manager'
      ? "SELECT * FROM vacation_requests"
      : "SELECT * FROM vacation_requests WHERE user_id = ?";

    const params = role === 'manager' ? [] : [user_id];

    db.all(query, params, (err, rows) => {
      if (err) {
        res.writeHead(500);
        return res.end("Failed to fetch requests");
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    });
  });
};

exports.updateRequestStatus = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { request_id, status } = JSON.parse(body); // status: "approved" or "rejected"

    db.run("UPDATE vacation_requests SET status = ? WHERE id = ?", [status, request_id], function (err) {
      if (err) {
        res.writeHead(500);
        return res.end("Failed to update request status");
      }

      res.writeHead(200);
      res.end("Request status updated");
    });
  });
};

exports.deleteRequest = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    const { request_id } = JSON.parse(body);

    db.run("DELETE FROM vacation_requests WHERE id = ?", [request_id], function (err) {
      if (err) {
        res.writeHead(500);
        return res.end("Failed to delete request");
      }

      res.writeHead(200);
      res.end("Request deleted");
    });
  });
};
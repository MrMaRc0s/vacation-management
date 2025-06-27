const fs = require('fs');
const path = require('path');
const { handleLogin } = require('./handlers/auth');
const { verifyToken } = require('./middleware/auth');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('./handlers/users');
const {
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest
} = require('./handlers/requests');

module.exports = (req, res) => {
  console.log(`${req.method} ${req.url}`); // Debug log

  //Serve static HTML files
  if (req.method === 'GET' && (req.url === '/' || req.url.endsWith('.html'))) {
    const filePath = path.join(__dirname, '..', 'public', req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end('Page Not Found');
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  if (req.method === 'GET' && req.url.endsWith('.js')) {
    const filePath = path.join(__dirname, '..', 'public', req.url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end('File Not Found');
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(content);
    });
    return;
  }

  const prettyUrls = {
    '/manager': 'manager.html',
    '/employee': 'employee.html'
  };

  if (req.method === 'GET' && prettyUrls[req.url]) {
    const filePath = path.join(__dirname, '..', 'public', prettyUrls[req.url]);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading file');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  // AUTH
  if (req.url === '/login' && req.method === 'POST') return handleLogin(req, res);

  // USER MANAGEMENT (protected by verifyToken)
  if (req.url.startsWith('/users')) {
    return verifyToken(req, res, () => {
      if (req.url === '/users' && req.method === 'GET') return getUsers(req, res);
      if (req.url === '/users' && req.method === 'POST') return createUser(req, res);
      if (req.url === '/users/update' && req.method === 'PUT') return updateUser(req, res);
      if (req.url === '/users/delete' && req.method === 'DELETE') return deleteUser(req, res);
      res.writeHead(404);
      res.end('Not Found');
    });
  }

  // VACATION REQUESTS (protected by verifyToken)
  if (req.url.startsWith('/requests')) {
    return verifyToken(req, res, () => {
      if (req.url === '/requests' && req.method === 'POST') return createRequest(req, res);
      if (req.url === '/requests/view' && req.method === 'POST') return getRequests(req, res);
      if (req.url === '/requests/status' && req.method === 'PUT') return updateRequestStatus(req, res);
      if (req.url === '/requests/delete' && req.method === 'DELETE') return deleteRequest(req, res);
      res.writeHead(404);
      res.end('Not Found');
    });
  }

  // 404 fallback
  res.writeHead(404);
  res.end('Not Found');
};

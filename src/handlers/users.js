const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../db/users');
const { createUserSchema, updateUserSchema, deleteUserSchema } = require('../validation/userSchemas');

exports.getUsers = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

exports.createUser = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const data = JSON.parse(body);
    const { error } = createUserSchema.validate(data);
    if (error) {
      res.writeHead(400);
      return res.end(`Validation error: ${error.message}`);
    }

    // Check if username or email already exists
    const existingUser = await userModel.getUserByUsernameOrEmail(data.username, data.email);
    if (existingUser) {
      res.writeHead(409); // Conflict
      return res.end("Username or email already exists");
    }

    const { username, email, password, role, employee_code } = data;
    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);
    await userModel.createUser({ id, username, email, password: hash, role, employee_code });
    res.writeHead(201);
    res.end("User created");
  });
};

exports.updateUser = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const data = JSON.parse(body);
    const { error } = updateUserSchema.validate(data);
    if (error) {
      res.writeHead(400);
      return res.end(`Validation error: ${error.message}`);
    }
    const { id, username, email, password } = data;
    let hash = null;
    if (password) hash = await bcrypt.hash(password, 10);
    await userModel.updateUser({ id, username, email, password: hash });
    res.writeHead(200);
    res.end("User updated");
  });
};

exports.deleteUser = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const data = JSON.parse(body);
    const { error } = deleteUserSchema.validate(data);
    if (error) {
      res.writeHead(400);
      return res.end(`Validation error: ${error.message}`);
    }
    const { id } = data;
    await userModel.deleteUser(id);
    res.writeHead(200);
    res.end("User deleted");
  });
};

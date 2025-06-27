const { v4: uuidv4 } = require('uuid');
const requestModel = require('../db/requests');
const { createRequestSchema, updateStatusSchema, deleteRequestSchema } = require('../validation/requestSchemas');

exports.createRequest = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const data = JSON.parse(body);
    console.log(data);
    const { error } = createRequestSchema.validate(data);
    if (error) {
      res.writeHead(400);
      return res.end(`Validation error: ${error.message}`);
    }
    const { user_id, start_date, end_date, reason } = data;
    const id = uuidv4();
    await requestModel.createRequest({ id, user_id, start_date, end_date, reason });
    res.writeHead(201);
    res.end("Request submitted");
  });
};

exports.getRequests = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const { user_id, role } = JSON.parse(body);
    const requests = role === 'manager'
      ? await requestModel.getAllRequests()
      : await requestModel.getRequestsByUser(user_id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(requests));
  });
};

exports.updateRequestStatus = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const data = JSON.parse(body);
    const { error } = updateStatusSchema.validate(data);
    if (error) {
      res.writeHead(400);
      return res.end(`Validation error: ${error.message}`);
    }
    const { request_id, status } = data;
    await requestModel.updateRequestStatus({ id: request_id, status });
    res.writeHead(200);
    res.end("Request status updated");
  });
};

exports.deleteRequest = async (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const data = JSON.parse(body);
    const { error } = deleteRequestSchema.validate(data);
    if (error) {
      res.writeHead(400);
      return res.end(`Validation error: ${error.message}`);
    }
    const { request_id } = data;
    await requestModel.deleteRequest(request_id);
    res.writeHead(200);
    res.end("Request deleted");
  });
};

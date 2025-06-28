# Vacation Management System

A full-featured Node.js-based employee vacation request system with role-based access (Manager / Employee), built with custom routing, SQLite, and Docker — no Express or frontend frameworks used.


## Features

- Login system with JWT-based authentication
- Role-based dashboards for Managers and Employees
- Vacation request submission, approval, rejection, and cancellation
- User management: create, update, delete accounts (by manager)
- Date validation, real-time UI updates
- SQLite for lightweight persistent storage
- Dockerized for easy deployment



## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Backend    | Node.js (no Express)    |
| Database   | SQLite                  |
| Frontend   | Vanilla JS + HTML + CSS |
| Auth       | JWT tokens              |
| Validation | Joi                     |
| Deploy     | Docker + Docker Compose |

## Quick Start

### With Docker (recommended)

```bash
docker-compose up --build
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development (manual)

```bash
npm install
node db/seed.js          # only needed once to create sample data
node src/server.js
```

## User Roles & Permissions

| Role     | Permissions                                                            |
| -------- | ---------------------------------------------------------------------- |
| Employee | Submit vacation request, delete own pending request                    |
| Manager  | Approve/reject/cancel vacation requests, create/update any user, delete only employees |

Demo users (from `seed.js`):

| Role     | Username        | Password |
| -------- | --------------- | -------- |
| Manager  | `AliceManager` | `managerpass` |
| Employee | `BobEmployee`  | `employeepass` |

## Project Structure

```
vacation-management/
├── db/   
│   ├── init.sql
│   └── seed.js         # Demo data and initial setup
├── public/             # Frontend HTML/JS/CSS
│   ├── index.html
│   ├── employee.html
│   └── manager.html
├── src/
│   ├── server.js       # Main HTTP server
│   ├── router.js       # Route dispatcher
│   ├── handlers/       # Business logic (auth, users, requests)
│   ├── db/             # SQLite wrapper and queries
│   └── validation/     # Joi schemas for backend validation
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Overview

Base URL: `http://localhost:3000`

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| POST   | `/login`           | Authenticates user and returns JWT |
| GET    | `/users`           | Returns all users (manager only)   |
| POST   | `/users`           | Create new user                    |
| PUT    | `/users/update`    | Update user info or password       |
| DELETE | `/users/delete`    | Delete user                        |
| POST   | `/requests`        | Submit vacation request            |
| POST   | `/requests/view`   | View requests (by role/user)       |
| PUT    | `/requests/status` | Approve/Reject/Cancel              |
| DELETE | `/requests/delete` | Delete pending request             |

All protected routes require:

```
Authorization: Bearer <your_token>
```

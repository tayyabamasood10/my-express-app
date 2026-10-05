# Task Management REST API

A REST API built with **Node.js, Express.js, and PostgreSQL** for managing users, projects, and tasks.

## Technologies

* Node.js
* Express.js
* PostgreSQL
* pg
* bcrypt
* Thunder Client

## Features

* Users CRUD
* Projects CRUD
* Tasks CRUD
* PostgreSQL relationships
* JOIN queries
* Task search
* Task filtering
* Validation
* Password hashing
* Login authentication
* Dashboard statistics
* Pagination
* Sorting
* Overdue task detection

## Database Tables

### Users

* id
* name
* email
* password
* created_at

### Projects

* id
* name
* description
* user_id
* created_at

### Tasks

* id
* title
* description
* status
* due_date
* project_id
* user_id
* created_at

## API Endpoints

### Users

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| POST   | `/users`     | Create user   |
| GET    | `/users`     | Get all users |
| GET    | `/users/:id` | Get user      |
| PUT    | `/users/:id` | Update user   |
| DELETE | `/users/:id` | Delete user   |

### Projects

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| POST   | `/projects`     | Create project   |
| GET    | `/projects`     | Get all projects |
| GET    | `/projects/:id` | Get project      |
| PUT    | `/projects/:id` | Update project   |
| DELETE | `/projects/:id` | Delete project   |

### Tasks

| Method | Endpoint                       | Description                             |
| ------ | ------------------------------ | --------------------------------------- |
| POST   | `/tasks`                       | Create task                             |
| GET    | `/tasks`                       | Get tasks                               |
| GET    | `/tasks/:id`                   | Get task                                |
| PUT    | `/tasks/:id`                   | Update task                             |
| DELETE | `/tasks/:id`                   | Delete task                             |
| GET    | `/tasks/details`               | Get tasks with project and user details |
| GET    | `/tasks/search?title=REST`     | Search tasks                            |
| GET    | `/tasks/filter?status=pending` | Filter tasks                            |
| GET    | `/tasks/overdue`               | Get overdue tasks                       |

### Authentication

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST   | `/login` | User login  |

### Dashboard

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | `/dashboard` | Get task statistics |

### Pagination

Example:

```text
GET /tasks?page=1&limit=5
```

### Sorting

Example:

```text
GET /tasks?sort=id&order=desc
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run start
```

The server runs on:

```text
http://localhost:5000
```

## Environment

Configure your PostgreSQL database connection in `db.js`.

Do not upload your real database password to GitHub.

## Project Structure

```text
my-express-app/
│
├── app.js
├── db.js
├── package.json
├── package-lock.json
├── README.md
└── node_modules/
```

## Author

Tayyaba Masood

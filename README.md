# TaskFlow – Backend

TaskFlow is an open-source, full-featured backend API designed for a Task Management. Built with Node.js, Express, and MongoDB, it offers robust support for features such as user and team management, projects, tasks and subtasks, labels, comments, and activity tracking.


---

## Features

- Authentication (JWT + Cookies)
- User & Role Management
- Project & Team Management
- Task Tracking with Subtasks
- Labels, Comments, and Activity Logs
- MongoDB Integration
- Dockerized Deployment
- Integration Tests with Jest & Supertest

---

## Tech Stack

- **Node.js**, **Express**
- **MongoDB**, **Mongoose**
- **JWT Authentication** (Access & Refresh Tokens)
- **Jest** & **Supertest** for Testing
- **Docker** & **Docker Compose**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shax26/taskflow-backend.git
cd taskflow-backend
```

### 2. Create `.env` File

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/task-manager
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
```

---

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Server

```bash
npm run dev
```

---

## Folder Structure

```bash
src/
├── config/            # MongoDB connection
├── controllers/       # Business logic
├── middlewares/       # Auth, error, etc.
├── models/            # Schemas
├── routes/            # API routes
├── tests/             # Jest test files
├── utils/             # Utility helpers
└── index.js           # Entry point
```

---

<!-- ## MongoDB Schemas

### User

```js
{
  name, email, password, role, avatar;
}
```

### Project

```js
{
  name, description, members: [User], tasks: [Task]
}
```

### Task

```js
{
  title, description, assignee, project, status, priority, dueDate,
  subtasks: [Subtask], labels: [String], comments: [Comment]
}
```

### Subtask

```js
{
  title, status, parentTask;
}
```

### Comment

```js
{
  text, author, task, createdAt;
}
```

### Label

```js
{
  name, color;
}
```

### Team

```js
{
  name, members: [User], projects: [Project]
}
```

### Activity

```js
{
  action, user, task, project, timestamp;
}
```

--- -->

## API Endpoints

Explore the complete API documentation for this project:

➡️ [**TaskFlow – Developer API Documentation**](https://github.com/shax26/taskflow-api)

---

## Testing

### Run All Tests

```bash
npm test
```

### Specific File

```bash
npm test -- src/tests/user.test.js
```

### By Test Name

```bash
npm test -- -t "User Management API"
```

---

## License

[MIT](./LICENSE)

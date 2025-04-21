# Task Management SaaS App – Backend

A full-featured backend API for a Task Management SaaS platform. Built with **Node.js**, **Express**, and **MongoDB**, this app supports features like user and team management, projects, tasks, subtasks, labels, comments, and activity tracking.

---

## ✨ Features

- ✅ Authentication (JWT + Cookies)
- 👤 User & Role Management
- 🢑 Project & Team Management
- ✅ Task Tracking with Subtasks
- 🍿 Labels, Comments, and Activity Logs
- 🛢️ MongoDB Integration
- 🐳 Dockerized Deployment
- 🧪 Integration Tests with Jest & Supertest

---

## 🛠️ Tech Stack

- **Node.js**, **Express**
- **MongoDB**, **Mongoose**
- **JWT Authentication** (Access & Refresh Tokens)
- **Jest** & **Supertest** for Testing
- **Docker** & **Docker Compose**

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager-backend.git
cd task-manager-backend
```

### 2. Create `.env` File

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/task-manager
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
```

---

## 💻 Local Development

### Install Dependencies

```bash
npm install
```

### Run Server

```bash
npm run dev
```

---

## 🐳 Docker Setup

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/task-manager
      - ACCESS_TOKEN_SECRET=youraccesstokensecret
      - REFRESH_TOKEN_SECRET=yourrefreshtokensecret
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Run with Docker

```bash
docker-compose up --build
```

---

## 📁 Folder Structure

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

## 📟 MongoDB Schemas

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

---

## 🔗 API Endpoints

---

## 🧪 Testing

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

## 📄 License

[MIT](./LICENSE)

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

let token;
let userId;
let projectId;
let taskId;

const testUser = {
  name: "Test User",
  email: "test1234@gmail.com",
  password: "test1234",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Register and login user
  await request(app).post("/api/auth/register").send(testUser);

  const loginRes = await request(app).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });

  token = loginRes.body.accessToken;

  const user = await User.findOne({ email: testUser.email });
  userId = user._id;

  // Create a project
  const newProject = {
    name: "Project Alpha",
    description: "Description...",
    owner: userId,
  };
  const projectRes = await request(app)
    .post("/api/projects")
    .set("Authorization", `Bearer ${token}`)
    .send(newProject);

  projectId = projectRes.body._id;
});

afterAll(async () => {
  await Task.deleteMany();
  await Project.deleteMany();
  await User.deleteMany();
  await mongoose.disconnect();
});

describe("Task Management API", () => {
  test("Create a task", async () => {
    const newTask = {
      title: "Task Alpha",
      description: "Sub task description...",
      project: projectId,
      assignedTo: userId,
      dueDate: "2025-05-10",
    };
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(newTask);

    taskId = res.body._id;

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Task Alpha");
  });

  test("Get all tasks", async () => {
    const res = await request(app)
      .get(`/api/tasks/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task Title",
        status: "in-progress",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task Title");
  });

  test("Delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });
});

const request = require("supertest");
const path = require("path");

const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Subtask = require("../models/Subtask");

let token;
let userId;
let projectId;
let taskId;
let subtaskId;

const userData = {
  name: "Subtask Alpha",
  email: "subtask@example.com",
  avatar: path.resolve(__dirname, "test-avatar.jpg"),
  password: "subtest123",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Register and login user
  await request(app)
    .post("/api/auth/register")
    .field("name", userData.name)
    .field("email", userData.email)
    .field("password", userData.password)
    .attach("avatar", userData.avatar);

  const loginRes = await request(app).post("/api/auth/login").send({
    email: userData.email,
    password: userData.password,
  });

  token = loginRes.body.accessToken;

  const user = await User.findOne({ email: userData.email });
  userId = user._id;

  // Create project and task
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

  const newTask = {
    title: "Task Alpha",
    description: "Sub task description...",
    project: projectId,
    assignedTo: userId,
    dueDate: "2025-05-10",
  };
  const taskRes = await request(app)
    .post("/api/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send(newTask);

  taskId = taskRes.body._id;
});

afterAll(async () => {
  await Subtask.deleteMany();
  await Task.deleteMany();
  await Project.deleteMany();
  await User.deleteMany();
  await mongoose.disconnect();
});

describe("Subtask API", () => {
  test("Create a subtask and should response are status code 201 and recieved and expected taskId must exist", async () => {
    const newSubtask = {
      title: "Subtask Alpha",
      task: taskId,
      createdBy: userId,
    };
    const res = await request(app)
      .post("/api/subtasks")
      .set("Authorization", `Bearer ${token}`)
      .send(newSubtask);

    subtaskId = res.body._id;

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Subtask Alpha");
    expect(res.body.task).toBe(taskId);
  });

  test("Get all subtasks for a task and should response with a 200 status code", async () => {
    const res = await request(app)
      .get(`/api/subtasks/task/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Update a subtask and should response with a 200 status code", async () => {
    const res = await request(app)
      .put(`/api/subtasks/task/${subtaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Subtask" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Subtask");
  });

  test("Delete a subtask and should response with a 200 status code", async () => {
    const res = await request(app)
      .delete(`/api/subtasks/task/${subtaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Subtask deleted successfully");
  });
});

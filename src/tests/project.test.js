const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

let token;
let userId;
let projectId;

const testUser = {
  name: "Test User",
  email: "test1234@gmail.com",
  password: "test1234",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Create user
  await request(app).post("/api/auth/register").send(testUser);

  const loginRes = await request(app).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });

  token = loginRes.body.accessToken;

  const user = await User.findOne({ email: testUser.email });
  userId = user._id;
});

afterAll(async () => {
  await Project.deleteMany();
  // await User.deleteMany();
  await mongoose.disconnect();
});

describe("Project Management API", () => {
  test("Create a new project and should response with a 201 status code", async () => {
    const newProject = {
      name: "Project Alpha",
      description: "Description...",
      owner: userId,
    };
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send(newProject);

    projectId = res.body._id;

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Project Alpha");
  });

  test("Get all projects and should response with a 200 status code", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Update a project and should response with a 200 status code", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Project" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Project");
  });

  test("Delete a project and should response with a 200 status code", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Project deleted successfully");
  });
});

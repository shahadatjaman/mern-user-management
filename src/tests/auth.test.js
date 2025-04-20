const request = require("supertest");
const app = require("../index"); // adjust if your app export path is different
const mongoose = require("mongoose");
const path = require("path");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // await mongoose.connection.dropDatabase();
  // await mongoose.connection.close();
});

describe("AUTH API", () => {
  const uniqueEmail = `user${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

  const userData = {
    name: "Shahadat",
    email: "shahadat12@gmail.com",
    password: "shahadat12",
  };

  test("register a new user and should response with a 200 status code", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .field("name", userData.name)
      .field("email", userData.email)
      .field("password", userData.password)
      .attach("avatar", path.resolve(__dirname, "test-avatar.jpg"));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("When the user already exist then should response with a 409 status code", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .field("name", userData.name)
      .field("email", userData.email)
      .field("password", userData.password)
      .attach("avatar", path.resolve(__dirname, "test-avatar.jpg"));

    expect(res.statusCode).toBe(409);
  });

  test("login existing user and should response with a 200 status cde", async () => {
    const res = await request(app).post("/api/auth/login").send(userData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("when username or passwor is wrong and should response with a 401 status code", async () => {
    const wrongUserData = { ...userData, password: "wrongpassword" };

    const res = await request(app).post("/api/auth/login").send(wrongUserData);
    expect(res.statusCode).toBe(401);
  });

  test("get refresh token and should response with a 200 status code", async () => {
    const login = await request(app).post("/api/auth/login").send(userData);
    const cookies = login.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("Logout user and should response with a 200 status code", async () => {
    const login = await request(app).post("/api/auth/login").send(userData);
    const cookies = login.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });
});

const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");

// Sample user for test

const testUser = {
  name: "Shahadat",
  email: "shahadat12@gmail.com",
  password: "shahadat12",
};

let token;

beforeAll(async () => {
  // Connect to the database
  const url = process.env.MONGO_URI;
  await mongoose.connect(url);

  // Login a user to get auth token
  const res = await request(app).post("/api/auth/login").send(testUser);

  token = res.body.accessToken;
});

afterAll(async () => {
  //   await User.deleteMany();
  await mongoose.disconnect();
});

describe("User Management API", () => {
  test("Get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    // console.log('res',res.body);

    if (res.statusCode !== 401) {
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  test("Update a user", async () => {
    const user = await User.findOne({ email: testUser.email });

    if (user) {
      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Name" });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Updated Name");
    } else {
      console.log("User not found, skipping update test.");
    }
  });

  test("Delete a user", async () => {
    const user = await User.findOne({ email: testUser.email });

    if (user) {
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User deleted successfully");
    } else {
      console.log("User not found, skipping delete test.");
    }
  });
});

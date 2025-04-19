const request = require('supertest');
const app = require('../index'); // adjust if your app export path is different
const mongoose = require('mongoose');
const path = require('path');

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

describe('Auth API', () => {
  const uniqueEmail = `shahadat+${Math.random().toString(36).substring(2, 10)}@example.com`;

    const userData = {
        name: 'Shahadat',
        email: uniqueEmail,
        password: 'test1234'
      };

  test('Register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .field('name', userData.name)
      .field('email', userData.email)
      .field('password', userData.password)
      .attach('avatar', path.resolve(__dirname, 'test-avatar.jpg'));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('Login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(userData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('Refresh token', async () => {
    const login = await request(app).post('/api/auth/login').send(userData);
    const cookies = login.headers['set-cookie'];

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('Logout user', async () => {
    const login = await request(app).post('/api/auth/login').send(userData);
    const cookies = login.headers['set-cookie'];

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });
});

import request from 'supertest';
import { sequelize } from '../src/config/database.js';
import app from '../src/index.js';
import { User } from '../src/models/User.js';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create({
      email: 'testuser@example.com',
      passwordHash: 'Test@1234' // Will be hashed by hook
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/auth/login - Successful login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'Test@1234'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - Invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'wrongpass'
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/auth/refresh-token - Refresh valid token', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'Test@1234'
    });
    const token = loginRes.body.token;
    const refreshRes = await request(app).post('/api/auth/refresh-token').send({ token });
    expect(refreshRes.statusCode).toEqual(200);
    expect(refreshRes.body).toHaveProperty('token');
  });

  test('POST /api/auth/logout - Logout endpoint', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});

import request from 'supertest';
import { sequelize } from '../src/config/database.js';
import app from '../src/index.js';
import { User } from '../src/models/User.js';
import { Transaction } from '../src/models/Transaction.js';

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({ email: 'banktest@example.com', passwordHash: 'BankTest@123' });
  const loginRes = await request(app).post('/api/auth/login').send({ email: 'banktest@example.com', password: 'BankTest@123' });
  token = loginRes.body.token;

  await Transaction.bulkCreate([
    {
      userId: user.id,
      amount: 1000,
      currency: 'INR',
      merchantName: 'Amazon',
      category: 'Shopping',
      transactionDate: new Date(),
      isFraud: false,
      anomalyScore: 0.1
    },
    {
      userId: user.id,
      amount: 50000,
      currency: 'INR',
      merchantName: 'Unknown Merchant',
      category: 'Others',
      transactionDate: new Date(),
      isFraud: true,
      anomalyScore: 5.0
    }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Bank Synchronization API', () => {
  test('GET /api/bank-sync/transactions - fetch paginated transactions', async () => {
    const res = await request(app)
      .get('/api/bank-sync/transactions')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.transactions.length).toBeGreaterThan(0);
  });

  test('POST /api/bank-sync/sync - invalid provider', async () => {
    const res = await request(app)
      .post('/api/bank-sync/sync')
      .set('Authorization', `Bearer ${token}`)
      .send({ provider: 'invalid' });
    expect(res.statusCode).toEqual(400);
  });
});

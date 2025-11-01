import request from 'supertest';
import { sequelize } from '../src/config/database.js';
import app from '../src/index.js';
import { User } from '../src/models/User.js';

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({ email: 'upitest@example.com', passwordHash: 'UpiTest@123' });
  const loginRes = await request(app).post('/api/auth/login').send({ email: 'upitest@example.com', password: 'UpiTest@123' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('UPI Payment API', () => {
  test('POST /api/upi/pay - initiate payment', async () => {
    const res = await request(app)
      .post('/api/upi/pay')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 1000,
        payeeVPA: 'merchant@upi',
        paymentMethod: 'PhonePe'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('transactionId');
  });

  test('GET /api/upi/payment-status/:id - invalid payment', async () => {
    const res = await request(app)
      .get('/api/upi/payment-status/invalid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
  });

  test('POST /api/upi/voice-payment - voice payment', async () => {
    const res = await request(app)
      .post('/api/upi/voice-payment')
      .set('Authorization', `Bearer ${token}`)
      .send({ voiceData: 'Pay 500 to merchant@upi' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
  });
});

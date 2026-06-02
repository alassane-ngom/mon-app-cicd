const request = require('supertest');
const app = require('./index');

describe('Test de l\'API', () => {
  test('GET / doit retourner status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET / doit retourner un message', async () => {
    const res = await request(app).get('/');
    expect(res.body.message).toBe('Hello CI/CD World! 🚀');
  });
});
const request = require('supertest');
const app = require('../../index');

describe('API TESTS', () => {

    test('GET /api/health doit retourner 200', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
    });

    test('GET /api/health doit retourner JSON', async () => {
        const res = await request(app).get('/api/health');

        expect(res.body).toHaveProperty('message');
    });

    test('GET /api/health message correct', async () => {
        const res = await request(app).get('/api/health');

        expect(res.body.message).toBe('Hello CI/CD World! 🚀');
    });

});
const request = require('supertest');
const app = require('../../index');

describe('AUTH TESTS', () => {

    let email = `test${Date.now()}@mail.com`;

    test('REGISTER CLIENT', async () => {
        const res = await request(app)
            .post('/api/auth/register/client')
            .send({
                nom: "Test",
                prenom: "User",
                email,
                telephone: "770000000",
                motDePasse: "123456"
            });

        console.log(res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
    });

    test('LOGIN CLIENT', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email,
                motDePasse: "123456",
                role: "client"
            });

        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

});
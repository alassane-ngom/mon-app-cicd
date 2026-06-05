const request = require('supertest');
const app = require('../../index');

describe('SERVICE ENDPOINTS', () => {
    let serviceId;

    test('CREATE service', async () => {
        const res = await request(app)
            .post('/api/services')
            .send({
                titre: 'Test Service',
                description: 'Description de test',
                prix: 150,
                proprietaireId: 1,
                disponibilite: true
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Service créé');
        expect(res.body.data).toHaveProperty('id');

        serviceId = res.body.data.id;
    });

    test('GET all services', async () => {
        const res = await request(app).get('/api/services');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET service by id', async () => {
        const res = await request(app).get(`/api/services/${serviceId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('titre', 'Test Service');
    });

    test('UPDATE service', async () => {
        const res = await request(app)
            .put(`/api/services/${serviceId}`)
            .send({
                titre: 'Service mis à jour',
                disponibilite: false
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Service mis à jour');
    });

    test('DELETE service', async () => {
        const res = await request(app).delete(`/api/services/${serviceId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Service supprimé');
    });
});

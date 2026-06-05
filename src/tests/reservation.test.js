const request = require('supertest');
const app = require('../../index');

describe('RESERVATION ENDPOINTS', () => {
    let clientId;
    let serviceId;
    let reservationId;
    const clientEmail = `reservation-client-${Date.now()}@mail.com`;

    beforeAll(async () => {
        const clientRes = await request(app)
            .post('/api/client')
            .send({
                nom: 'Client Test',
                prenom: 'Reservation',
                email: clientEmail,
                telephone: '770000001',
                motDePasse: '123456'
            });

        clientId = clientRes.body.id;

        const serviceRes = await request(app)
            .post('/api/services')
            .send({
                titre: 'Service pour réservation',
                description: 'Test réservation',
                prix: 80,
                proprietaireId: 1,
                disponibilite: true
            });

        serviceId = serviceRes.body.data.id;
    });

    test('CREATE reservation', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send({
                serviceId,
                clientId,
                dateReservation: '2026-06-10T10:00:00Z',
                commentaire: 'Test réservation'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('statut', 'en_attente');

        reservationId = res.body.data.id;
    });

    test('GET all reservations', async () => {
        const res = await request(app).get('/api/reservations');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET reservation by id', async () => {
        const res = await request(app).get(`/api/reservations/${reservationId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('clientId', clientId);
    });

    test('UPDATE reservation', async () => {
        const res = await request(app)
            .put(`/api/reservations/${reservationId}`)
            .send({ statut: 'confirmee' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Réservation mise à jour');
    });

    test('DELETE reservation', async () => {
        const res = await request(app).delete(`/api/reservations/${reservationId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Réservation supprimée');
    });
});

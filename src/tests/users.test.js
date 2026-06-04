const request = require('supertest');
const app = require('../../index');

describe('CLIENT ENDPOINTS', () => {

    let clientId;

    test('CREATE client', async () => {
        const res = await request(app)
            .post('/api/client')
            .send({
                nom: "Test",
                prenom: "User",
                email: "test@email.com",
                telephone: "777777777",
                motDePasse: "123456"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Client créé");

        clientId = res.body.id;
    });

});

test('GET client by id', async () => {

    const res = await request(app)
        .get(`/api/client/${clientId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
});

test('UPDATE client', async () => {

    const res = await request(app)
        .put(`/api/client/${clientId}`)
        .send({
            nom: "Updated"
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Client mis à jour avec succès");
});

test('DELETE client', async () => {

    const res = await request(app)
        .delete(`/api/client/${clientId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Client supprimé");
});
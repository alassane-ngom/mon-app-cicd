const db = require('../data/db');
const Reservation = require('../models/Reservation');

const VALID_STATUSES = ['en_attente', 'confirmee', 'annulee'];

exports.getAllReservations = (req, res) => {
    db.all(
        'SELECT * FROM reservations',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lecture réservations', error: err.message });
            }
            res.json(rows);
        }
    );
};

exports.getReservationById = (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM reservations WHERE id = ?',
        [id],
        (err, reservation) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lecture réservation', error: err.message });
            }
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation introuvable' });
            }
            res.json(reservation);
        }
    );
};

exports.createReservation = (req, res) => {
    const { serviceId, clientId, dateReservation, commentaire } = req.body;

    if (!serviceId || !clientId || !dateReservation) {
        return res.status(400).json({ message: 'serviceId, clientId et dateReservation sont requis' });
    }

    db.get('SELECT * FROM services WHERE id = ?', [serviceId], (serviceErr, service) => {
        if (serviceErr) {
            return res.status(500).json({ message: 'Erreur vérification service', error: serviceErr.message });
        }
        if (!service) {
            return res.status(404).json({ message: 'Service introuvable' });
        }

        db.get('SELECT * FROM clients WHERE id = ?', [clientId], (clientErr, client) => {
            if (clientErr) {
                return res.status(500).json({ message: 'Erreur vérification client', error: clientErr.message });
            }
            if (!client) {
                return res.status(404).json({ message: 'Client introuvable' });
            }

            db.run(
                `INSERT INTO reservations (serviceId, clientId, dateReservation, statut, commentaire)
                 VALUES (?, ?, ?, ?, ?)`,
                [serviceId, clientId, dateReservation, 'en_attente', commentaire || null],
                function (insertErr) {
                    if (insertErr) {
                        return res.status(500).json({ message: 'Erreur création réservation', error: insertErr.message });
                    }

                    const reservation = new Reservation(
                        this.lastID,
                        serviceId,
                        clientId,
                        dateReservation,
                        'en_attente',
                        commentaire || null
                    );

                    res.status(201).json({ message: 'Réservation créée', data: reservation });
                }
            );
        });
    });
};

exports.updateReservation = (req, res) => {
    const id = req.params.id;
    const { dateReservation, statut, commentaire } = req.body;

    if (statut && !VALID_STATUSES.includes(statut)) {
        return res.status(400).json({ message: `statut invalide, valeurs autorisées: ${VALID_STATUSES.join(', ')}` });
    }

    db.get('SELECT * FROM reservations WHERE id = ?', [id], (err, existingReservation) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lecture réservation', error: err.message });
        }
        if (!existingReservation) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }

        const updatedReservation = {
            dateReservation: dateReservation ?? existingReservation.dateReservation,
            statut: statut ?? existingReservation.statut,
            commentaire: commentaire ?? existingReservation.commentaire
        };

        db.run(
            `UPDATE reservations SET dateReservation = ?, statut = ?, commentaire = ? WHERE id = ?`,
            [updatedReservation.dateReservation, updatedReservation.statut, updatedReservation.commentaire, id],
            function (updateErr) {
                if (updateErr) {
                    return res.status(500).json({ message: 'Erreur mise à jour réservation', error: updateErr.message });
                }
                res.json({ message: 'Réservation mise à jour' });
            }
        );
    });
};

exports.deleteReservation = (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM reservations WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erreur suppression réservation', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }
        res.json({ message: 'Réservation supprimée' });
    });
};

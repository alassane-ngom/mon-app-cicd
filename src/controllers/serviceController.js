const db = require('../data/db');
const Service = require('../models/Service');

exports.getAllServices = (req, res) => {
    db.all(
        'SELECT * FROM services',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lecture services', error: err.message });
            }
            res.json(rows);
        }
    );
};

exports.getServiceById = (req, res) => {
    const id = req.params.id;

    db.get(
        'SELECT * FROM services WHERE id = ?',
        [id],
        (err, service) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lecture service', error: err.message });
            }

            if (!service) {
                return res.status(404).json({ message: 'Service introuvable' });
            }

            res.json(service);
        }
    );
};

exports.createService = (req, res) => {
    const { titre, description, prix, proprietaireId, disponibilite = true } = req.body;

    if (!titre || !prix || !proprietaireId) {
        return res.status(400).json({ message: 'titre, prix et proprietaireId sont requis' });
    }

    const disponibiliteValue = disponibilite ? 1 : 0;

    db.run(
        `INSERT INTO services (titre, description, prix, proprietaireId, disponibilite)
         VALUES (?, ?, ?, ?, ?)`,
        [titre, description || null, prix, proprietaireId, disponibiliteValue],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erreur création service', error: err.message });
            }

            const service = new Service(
                this.lastID,
                titre,
                description || null,
                prix,
                proprietaireId,
                Boolean(disponibiliteValue)
            );

            res.status(201).json({ message: 'Service créé', data: service });
        }
    );
};

exports.updateService = (req, res) => {
    const id = req.params.id;
    const { titre, description, prix, proprietaireId, disponibilite } = req.body;

    db.get(
        'SELECT * FROM services WHERE id = ?',
        [id],
        (err, existingService) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lecture service', error: err.message });
            }

            if (!existingService) {
                return res.status(404).json({ message: 'Service introuvable' });
            }

            const updatedService = {
                titre: titre ?? existingService.titre,
                description: description ?? existingService.description,
                prix: prix ?? existingService.prix,
                proprietaireId: proprietaireId ?? existingService.proprietaireId,
                disponibilite: typeof disponibilite === 'boolean'
                    ? (disponibilite ? 1 : 0)
                    : existingService.disponibilite
            };

            db.run(
                `UPDATE services SET titre = ?, description = ?, prix = ?, proprietaireId = ?, disponibilite = ? WHERE id = ?`,
                [
                    updatedService.titre,
                    updatedService.description,
                    updatedService.prix,
                    updatedService.proprietaireId,
                    updatedService.disponibilite,
                    id
                ],
                function (updateErr) {
                    if (updateErr) {
                        return res.status(500).json({ message: 'Erreur mise à jour service', error: updateErr.message });
                    }

                    res.json({ message: 'Service mis à jour' });
                }
            );
        }
    );
};

exports.deleteService = (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM services WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erreur suppression service', error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Service introuvable' });
            }

            res.json({ message: 'Service supprimé' });
        }
    );
};

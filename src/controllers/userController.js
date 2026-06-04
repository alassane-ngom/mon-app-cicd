const Client = require('../models/Client');
const Proprietaire = require('../models/Proprietaire');

const db = require('../data/db');


// ========================
// CLIENT
// ========================

exports.createClient = (req, res) => {

    const { nom, prenom, email, telephone, motDePasse } = req.body;

    db.get(
        "SELECT * FROM clients WHERE email = ?",
        [email],
        (err, row) => {

            if (row) {
                return res.status(400).json({
                    message: "Email déjà utilisé"
                });
            }

            db.run(
                `INSERT INTO clients (nom, prenom, email, telephone, motDePasse)
                 VALUES (?, ?, ?, ?, ?)`,
                [nom, prenom, email, telephone, motDePasse],
                function (err) {

                    res.status(201).json({
                        message: "Client créé",
                        id: this.lastID
                    });

                }
            );
        }
    );
};


// ========================
// GET ONE CLIENT
// ========================

exports.getClient = (req, res) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM clients WHERE id = ?",
        [id],
        (err, row) => {

            if (!row) {
                return res.status(404).json({
                    message: "Client introuvable"
                });
            }

            res.json(row);
        }
    );
};


// ========================
// GET ALL CLIENTS
// ========================

exports.getAllClients = (req, res) => {

    db.all(
        "SELECT * FROM clients",
        [],
        (err, rows) => {
            res.json(rows);
        }
    );
};


// ========================
// UPDATE CLIENT
// ========================

exports.updateClient = (req, res) => {

    const id = req.params.id;

    const { nom, prenom, email, telephone, motDePasse } = req.body;

    // Vérifier si le client existe
    db.get(
        "SELECT * FROM clients WHERE id = ?",
        [id],
        (err, client) => {

            if (!client) {
                return res.status(404).json({
                    message: "Client introuvable"
                });
            }

            // Mise à jour
            db.run(
                `UPDATE clients 
                 SET nom = ?, prenom = ?, email = ?, telephone = ?, motDePasse = ?
                 WHERE id = ?`,
                [
                    nom ?? client.nom,
                    prenom ?? client.prenom,
                    email ?? client.email,
                    telephone ?? client.telephone,
                    motDePasse ?? client.motDePasse,
                    id
                ],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: "Erreur lors de la mise à jour"
                        });
                    }

                    res.json({
                        message: "Client mis à jour avec succès"
                    });
                }
            );
        }
    );
};


// ========================
// DELETE CLIENT
// ========================

exports.deleteClient = (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM clients WHERE id = ?",
        [id],
        function (err) {

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Client introuvable"
                });
            }

            res.json({
                message: "Client supprimé"
            });
        }
    );
};


// ========================
// PROPRIETAIRE
// ========================

exports.createProprietaire = (req, res) => {

    const { nom, prenom, email, telephone, motDePasse } = req.body;

    const existingProprio = db.proprietaires.find(p => p.email === email);

    if (existingProprio) {
        return res.status(400).json({
            message: "Email déjà utilisé pour un propriétaire"
        });
    }

    const proprietaire = new Proprietaire(
        db.proprietaires.length + 1,
        nom,
        prenom,
        email,
        telephone,
        motDePasse
    );

    db.proprietaires.push(proprietaire);

    res.status(201).json({
        message: "Propriétaire créé avec succès",
        data: proprietaire
    });
};


// ========================
// GET ONE PROPRIETAIRE
// ========================

exports.getProprietaire = (req, res) => {

    const id = parseInt(req.params.id);

    const proprietaire = db.proprietaires.find(p => p.id === id);

    if (!proprietaire) {
        return res.status(404).json({
            message: 'Propriétaire introuvable'
        });
    }

    res.json(proprietaire);
};


// ========================
// GET ALL PROPRIETAIRES
// ========================

exports.getAllProprietaires = (req, res) => {
    res.json(db.proprietaires);
};


// ========================
// UPDATE PROPRIETAIRE
// ========================

exports.updateProprietaire = (req, res) => {

    const id = parseInt(req.params.id);

    const proprietaire = db.proprietaires.find(p => p.id === id);

    if (!proprietaire) {
        return res.status(404).json({
            message: "Propriétaire introuvable"
        });
    }

    const { nom, prenom, email, telephone, motDePasse } = req.body;

    proprietaire.nom = nom ?? proprietaire.nom;
    proprietaire.prenom = prenom ?? proprietaire.prenom;
    proprietaire.email = email ?? proprietaire.email;
    proprietaire.telephone = telephone ?? proprietaire.telephone;
    proprietaire.motDePasse = motDePasse ?? proprietaire.motDePasse;

    res.json({
        message: "Propriétaire mis à jour",
        data: proprietaire
    });
};


// ========================
// DELETE PROPRIETAIRE
// ========================

exports.deleteProprietaire = (req, res) => {

    const id = parseInt(req.params.id);

    const index = db.proprietaires.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Propriétaire introuvable"
        });
    }

    db.proprietaires.splice(index, 1);

    res.json({
        message: "Propriétaire supprimé"
    });
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../data/db');

const SECRET = "SECRET_KEY_123";


// ========================
// REGISTER CLIENT
// ========================
exports.registerClient = (req, res) => {

    const { nom, prenom, email, telephone, motDePasse } = req.body;

    const hashedPassword = bcrypt.hashSync(motDePasse, 10);

    db.run(
        `INSERT INTO clients (nom, prenom, email, telephone, motDePasse)
         VALUES (?, ?, ?, ?, ?)`,
        [nom, prenom, email, telephone, hashedPassword],
        function (err) {

            if (err) {
                return res.status(400).json({ message: "Erreur inscription client" });
            }

            res.status(201).json({
                message: "Client inscrit avec succès",
                id: this.lastID
            });
        }
    );
};


// ========================
// REGISTER PROPRIETAIRE
// ========================
exports.registerProprietaire = (req, res) => {

    const { nom, prenom, email, telephone, motDePasse } = req.body;

    const hashedPassword = bcrypt.hashSync(motDePasse, 10);

    db.run(
        `INSERT INTO proprietaires (nom, prenom, email, telephone, motDePasse)
         VALUES (?, ?, ?, ?, ?)`,
        [nom, prenom, email, telephone, hashedPassword],
        function (err) {

            if (err) {
                return res.status(400).json({ message: "Erreur inscription propriétaire" });
            }

            res.status(201).json({
                message: "Propriétaire inscrit avec succès",
                id: this.lastID
            });
        }
    );
};


// ========================
// LOGIN
// ========================
exports.login = (req, res) => {

    const { email, motDePasse, role } = req.body;

    const table = role === "client" ? "clients" : "proprietaires";

    db.get(
        `SELECT * FROM ${table} WHERE email = ?`,
        [email],
        (err, user) => {

            if (!user) {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }

            const match = bcrypt.compareSync(motDePasse, user.motDePasse);

            if (!match) {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }

            const token = jwt.sign(
                { id: user.id, role },
                SECRET,
                { expiresIn: "2h" }
            );

            res.json({
                message: "Connexion réussie",
                token,
                role
            });
        }
    );
};
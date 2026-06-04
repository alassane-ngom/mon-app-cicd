const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

// ========================
// CREATION DES TABLES
// ========================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT,
            prenom TEXT,
            email TEXT UNIQUE,
            telephone TEXT,
            motDePasse TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS proprietaires (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT,
            prenom TEXT,
            email TEXT UNIQUE,
            telephone TEXT,
            motDePasse TEXT
        )
    `);
});

module.exports = db;
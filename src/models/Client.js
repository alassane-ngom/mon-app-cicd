const Utilisateur = require('./Utilisateur');

class Client extends Utilisateur {
    constructor(
        id,
        nom,
        prenom,
        email,
        telephone,
        motDePasse
    ) {
        super(
            id,
            nom,
            prenom,
            email,
            telephone,
            motDePasse
        );
    }
}

module.exports = Client;
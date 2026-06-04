class Utilisateur {
    constructor(
        id,
        nom,
        prenom,
        email,
        telephone,
        motDePasse
    ) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
    }
}

module.exports = Utilisateur;
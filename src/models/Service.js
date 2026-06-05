class Service {
    constructor(
        id,
        titre,
        description,
        prix,
        proprietaireId,
        disponibilite = true
    ) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.prix = prix;
        this.proprietaireId = proprietaireId;
        this.disponibilite = disponibilite;
    }
}

module.exports = Service;

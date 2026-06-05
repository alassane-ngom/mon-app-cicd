class Reservation {
    constructor(
        id,
        serviceId,
        clientId,
        dateReservation,
        statut = 'en_attente',
        commentaire = null
    ) {
        this.id = id;
        this.serviceId = serviceId;
        this.clientId = clientId;
        this.dateReservation = dateReservation;
        this.statut = statut;
        this.commentaire = commentaire;
    }
}

module.exports = Reservation;

function validateUser(req, res, next) {
    const {
        nom,
        prenom,
        email,
        telephone,
        motDePasse
    } = req.body;

    if (!nom || !prenom || !email || !telephone || !motDePasse) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires"
        });
    }

    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Email invalide"
        });
    }

    if (motDePasse.length < 6) {
        return res.status(400).json({
            message: "Mot de passe trop court (min 6 caractères)"
        });
    }

    next();
}

module.exports = validateUser;
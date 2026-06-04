const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validateUser = require('../validators/userValidator');


// ========================
// CLIENT
// ========================

router.post('/client', validateUser, userController.createClient);
router.get('/client/:id', userController.getClient);
router.get('/clients', userController.getAllClients);
router.put('/client/:id', validateUser, userController.updateClient);
router.delete('/client/:id', userController.deleteClient);


// ========================
// PROPRIETAIRE
// ========================

router.post('/proprietaire', validateUser, userController.createProprietaire);
router.get('/proprietaire/:id', userController.getProprietaire);
router.get('/proprietaires', userController.getAllProprietaires);
router.put('/proprietaire/:id', validateUser, userController.updateProprietaire);
router.delete('/proprietaire/:id', userController.deleteProprietaire);


module.exports = router;
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


// ========================
// REGISTER
// ========================
router.post('/register/client', authController.registerClient);
router.post('/register/proprietaire', authController.registerProprietaire);


// ========================
// LOGIN
// ========================
router.post('/login', authController.login);

module.exports = router;
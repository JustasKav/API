const express = require('express');
const authController = require("/Users/Justas/Desktop/finalapi/controllers/auth");
const router = express.Router();
          
router.post('/register', authController.createUser);
router.post('/login', authController.login);
router.get('/logout', authController.logout);




module.exports = router;
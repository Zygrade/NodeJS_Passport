const express = require('express');
const router = express.Router();
const { ensureAuthentication } = require('../config/auth');

// Welcome page 
router.get('/', (req,res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthentication , (req,res) => res.render('dashboard',{ userName : req.user.name }));

module.exports = router;
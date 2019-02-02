const express = require('express');
const router = express.Router();
randomWords = require('random-words');
const { ensureAuth, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome', {
        user: req.user
    });
});

router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('index/dashboard')
});

module.exports = router;
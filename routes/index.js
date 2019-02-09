const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');


const { ensureAuth, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome', {
        user: req.user
    });
});

router.get('/dashboard', ensureAuth, (req, res) => {
    Story.find({
        user: req.user._id
    })
        .populate('user')
        .sort({date: 'desc'})
        .then((stories) => {
            if (req.user.birthDate === null) {
                res.render('user/edit');
            } else {
                res.render('index/dashboard', { stories });
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;
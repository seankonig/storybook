const express = require('express');
const mongoose = require('mongoose');
var sanitizeHtml = require('sanitize-html');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

const router = express.Router();

const { ensureAuth } = require('../helpers/auth');

router.get('/:id', ensureAuth, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then((user) => {
            res.render('user/index', { user });
        })
        .catch((err) => {
            console.log('cannot find user');
        });
});

router.get('/edit/:id', ensureAuth, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then((user) => {
            res.render('user/edit', { user });
        })
        .catch((err) => {
            console.log('cannot find user');
        });
});

router.put('/edit/:id', ensureAuth, (req, res) => {
    User.findOneAndUpdate({
        _id: req.params.id
    },
        {
            $set: {
                username: req.body.username,
                location: req.body.location,
                birthDate: req.body.birthDate,
                website: req.body.website,
                about: sanitizeHtml(req.body.about)
            }
        })
        .then((user) => {
            res.render('user/index', { user });
        })
        .catch((err) => {
            console.log('cannot find user');
        });
});
module.exports = router;
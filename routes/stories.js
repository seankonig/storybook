const express = require('express');
const mongoose = require('mongoose');
var sanitizeHtml = require('sanitize-html');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

const router = express.Router();

const { ensureAuth } = require('../helpers/auth');

router.get('/', (req, res) => {
    Story.find({
        status: 'public'
    })
    .populate('user')
    .then((stories) => {
        res.render('stories/index', { stories });
    })
    .catch((err) => {
        console.log('no stories to show');
    });
});

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

router.get('/edit/:id', ensureAuth, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then((story) => {
        res.render('stories/edit', { story });
    })
    .catch((err) => {
        console.log(err);
    });
    
});

router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then((story) => {
        res.render('stories/show', { story });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post('/', (req, res) => {
    let allowComments = req.body.allowComments === 'on' ? true : false;
    
    const newStory = {
        title: req.body.title,
        story: sanitizeHtml(req.body.story),
        status: req.body.status,
        allowComments,
        user: req.user._id
    }

    new Story(newStory)
    .save()
    .then((story) => {
        res.redirect(`/stories/show/${story._id}`);
    })
    .catch((err) => {
        console.log(err);
    });
});

router.put('/:id', (req, res) => {
    let allowComments = req.body.allowComments === 'on' ? true : false;
    Story.findOneAndUpdate({
        _id: req.params.id
    },
        {
            $set: {
                title: req.body.title,
                story: sanitizeHtml(req.body.story),
                status: req.body.status,
                website: req.body.website,
                allowComments
            }
        })
        .then((story) => {
            res.redirect(`/stories/show/${story._id}`);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.delete('/:id', (req, res) => {
    Story.findOneAndDelete({
        _id: req.params.id
    })
    .then(() => {
        res.redirect('/dashboard');
    })
    .catch((err) => {
        console.log(err);
    });
    
});




module.exports = router;
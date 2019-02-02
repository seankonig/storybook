const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories')
const User = mongoose.model('users')

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
    })    
});

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then((story) => {
        console.log(story);
        res.render('stories/show', { story });
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/', (req, res) => {
    let allowComments = req.body.allowComments === 'on' ? true : false;
    
    const newStory = {
        title: req.body.title,
        story: req.body.story,
        status: req.body.status,
        allowComments,
        user: req.user.id
    }

    new Story(newStory)
    .save()
    .then((story) => {
        res.redirect(`/stories/show/${story._id}`);
    })
    .catch((err) => {
        console.log(err);
    })
})

module.exports = router;
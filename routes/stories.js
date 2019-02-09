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
    .sort({date: 'desc'})
    .then((stories) => {
        res.render('stories/index', { stories });
    })
    .catch((err) => {
        console.log('no stories to show');
    });
});

router.get('/add', ensureAuth, (req, res) => {
    Story.findOne({user: req.user._id}).sort({date: 'desc'}).limit(5)
    .then((allStories) => {
        res.render('stories/add', { allStories });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get('/edit/:id', ensureAuth, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then((story) => {
        if (story.user.id != req.user.id){
            res.redirect('/stories');
        } else {
            Story.find({user: req.user.id}).sort({date: 'desc'}).limit(5)
            .then((allStories) => {
                res.render('stories/edit', { story, allStories });
            })
            .catch((err) => {
                console.log(err);
            });
        }
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
    .populate('comments.commentUser')
    .then((story) => {
        console.log(story.comments);
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
                allowComments
            }
        })
        .populate('user')
        .then((story) => {
            res.redirect('/stories/show/' + story._id);
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

router.post('/comment/:id', (req, res) => {
    const comment = {
        commentBody: req.body.comment,
        commentUser: req.user._id 
    }
    
    Story.findOne({
        _id: req.params.id
    })
    .then((story) => {
        //push to story comment array
        story.comments.unshift(comment);
        story.save()
        .then((story) => {
            res.redirect(`/stories/show/${story._id}`)
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});




module.exports = router;
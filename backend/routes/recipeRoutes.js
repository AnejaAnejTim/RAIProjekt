const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js');
const Comment = require('../models/commentModel.js');
const path = require('path');
const mongoose = require('mongoose');
const Recipe = require('../models/recipeModel.js');


function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

function handleMulterError(err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: 'File too large. Maximum size is 5MB.',
            error: err
        });
    }
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            message: 'Only image files are allowed.',
            error: err
        });
    }
    next(err);
}

/*
 * GET routes
 */
router.get('/', recipeController.list);
router.get('/trending', recipeController.trending);
router.get('/myRecipes', requiresLogin, recipeController.showMyRecipes);

router.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/recipes/', filename);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'Image not found' });
        }
    });
});

router.get('/:id', recipeController.show);

/*
 * Comment routes
 */

router.get('/:id/comments', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid recipe ID' });
        }
        const comments = await Comment.find({ recipe: req.params.id })
            .populate('user', 'username');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

router.post('/:id/comments', requiresLogin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid recipe ID' });
        }
        if (!req.body.text || req.body.text.trim() === '') {
            return res.status(400).json({ error: 'Comment text cannot be empty' });
        }

        const recipeExists = await Recipe.exists({ _id: req.params.id });
        if (!recipeExists) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const comment = new Comment({
            recipe: req.params.id,
            user: req.session.userId,
            text: req.body.text.trim()
        });

        await comment.save();
        await comment.populate('user', 'username');

        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Error adding comment' });
    }
});


/*
 * POST routes
 */
router.post('/', requiresLogin, recipeController.uploadImages, handleMulterError, recipeController.create);

/*
 * PUT routes
 */
router.put('/:id', recipeController.uploadImages, handleMulterError, recipeController.update);

/*
 * DELETE routes
 */
router.delete('/:id', recipeController.remove);
router.delete('/:id/images/:filename', requiresLogin, recipeController.deleteImage);

module.exports = router;
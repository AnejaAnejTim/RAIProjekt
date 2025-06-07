var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const auth = require('../middleware/auth');
const loginConfirmationController = require('../controllers/loginConfirmationController');
const multer = require('multer');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        console.log(req.session)
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.delete('/favorites/:id', requiresLogin, async (req, res) => {
    const userId = req.session.userId;
    const recipeId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({error: 'User not found'});
    user.favorites = user.favorites.filter(fav => fav.toString() !== recipeId);
    await user.save();
    res.json({success: true});
});

router.post('/favorites/:id', requiresLogin, async (req, res) => {
    const userId = req.session.userId;
    const recipeId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({error: 'User not found'});
    if (!await Recipe.exists({_id: recipeId})) return res.status(404).json({error: 'Recipe not found'});

    if (user.favorites.includes(recipeId)) {
        return res.status(400).json({error: 'Already favorited'});
    }
    user.favorites.push(recipeId);
    await user.save();
    res.json({success: true});
});
// In backend/routes/userRoutes.js
router.get('/favorites', requiresLogin, async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId).populate('favorites');
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

router.get('/', userController.list);
router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/appValidation', auth, userController.appValidation);

router.get('/:id', userController.show);

router.post('/login-confirmation/initiate', loginConfirmationController.initiateLogin);
router.post('/login-confirmation/complete', loginConfirmationController.completeLogin);
router.post('/userExists', userController.userExists);

router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/appLogin', userController.appLogin);
router.post('/logout', userController.appLogout);
router.post('/savePushToken', userController.savePushToken);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

module.exports = router;

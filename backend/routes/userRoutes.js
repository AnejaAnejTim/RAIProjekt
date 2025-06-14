var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const auth = require('../middleware/auth');
const loginConfirmationController = require('../controllers/loginConfirmationController');
const multer = require('multer');

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

router.get('/favorites', requiresLogin, userController.getFavorites);
router.post('/favorites/:id', requiresLogin, userController.addFavorite);
router.delete('/favorites/:id', requiresLogin, userController.removeFavorite);

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

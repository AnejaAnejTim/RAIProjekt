const express = require('express');
const router = express.Router();
const loginConfirmationController = require('../controllers/loginConfirmationController');
const authMiddleware = require('../middleware/auth');

// Web routes
router.post('/initiate', loginConfirmationController.initiateLogin);
router.get('/status/:confirmationToken', loginConfirmationController.checkLoginStatus);
router.post('/complete', loginConfirmationController.completeLogin);

// Mobile routes
router.use(authMiddleware);
router.get('/pending', authMiddleware, loginConfirmationController.getPendingLogins);
router.post('/approve', loginConfirmationController.approveLogin);
router.post('/deny', loginConfirmationController.denyLogin);

module.exports = router;
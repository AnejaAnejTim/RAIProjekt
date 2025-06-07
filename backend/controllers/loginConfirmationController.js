const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const LoginRequest = require('../models/loginConfirmationModel');
const PushNotificationModel = require('../models/pushNotificationModel'); 

const pendingLogins = new Map();

const generateConfirmationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

exports.initiateLogin = async (req, res) => {
    try {
        const {email, password, deviceInfo} = req.body;

        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const confirmationToken = generateConfirmationToken();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const loginRequest = new LoginRequest({
            userId: user._id,
            confirmationToken,
            deviceInfo,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            expiresAt,
            status: 'pending'
        });

        await loginRequest.save();

        pendingLogins.set(confirmationToken, {
            userId: user._id,
            email: user.email,
            deviceInfo,
            createdAt: new Date(),
            expiresAt
        });

        await sendPushNotification(user._id, {
            title: 'Login Confirmation Required',
            body: `New login attempt from ${deviceInfo.browser || 'Unknown'} on ${deviceInfo.os || 'Unknown'}`,
            data: {
                type: 'login_confirmation',
                token: confirmationToken,
                deviceInfo,
                timestamp: new Date().toISOString()
            }
        });

        res.json({
            success: true,
            message: 'Login confirmation sent to your mobile device',
            confirmationToken,
            expiresIn: 300
        });

    } catch (error) {
        console.error('Login initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.checkLoginStatus = async (req, res) => {
    try {
        const {confirmationToken} = req.params;

        const loginRequest = await LoginRequest.findOne({
            confirmationToken,
            expiresAt: {$gt: new Date()}
        });

        if (!loginRequest) {
            return res.status(404).json({
                success: false,
                message: 'Login request not found or expired'
            });
        }

        res.json({
            success: true,
            status: loginRequest.status,
            expiresAt: loginRequest.expiresAt
        });

    } catch (error) {
        console.error('Login status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.approveLogin = async (req, res) => {
    try{
        const {confirmationToken} = req.body;
        const userId = req.user.id;

        const loginRequest = await LoginRequest.findOne({
            confirmationToken,
            userId,
            status: 'pending',
            expiresAt: {$gt: new Date()}
        });

        if (!loginRequest) {
            return res.status(404).json({
                success: false,
                message: 'Login request not found or expired'
            });
        }

        loginRequest.status = 'approved';
        loginRequest.approvedAt = new Date();
        await loginRequest.save();

        pendingLogins.set(confirmationToken, {
            ...pendingLogins.get(confirmationToken),
            status: 'approved'
        });

        res.json({
            success: true,
            message: 'Login approved successfully'
        });

    } catch (error) {
        console.error('Login approval error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


exports.denyLogin = async (req, res) => {
    try {
        const {confirmationToken} = req.body;
        const userId = req.user.id;

        const loginRequest = await LoginRequest.findOne({
            confirmationToken,
            userId,
            status: 'pending',
            expiresAt: {$gt: new Date()}
        });

        if (!loginRequest) {
            return res.status(404).json({
                success: false,
                message: 'Login request not found or expired'
            });
        }

        loginRequest.status = 'denied';
        loginRequest.deniedAt = new Date();
        await loginRequest.save();

        pendingLogins.delete(confirmationToken);

        res.json({
            success: true,
            message: 'Login denied successfully'
        });

    } catch (error) {
        console.error('Login denial error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.completeLogin = async (req, res) => {
    try {
        const {confirmationToken} = req.body;

        const pendingLogin = pendingLogins.get(confirmationToken);
        const loginRequest = await LoginRequest.findOne({
            confirmationToken,
            status: 'approved',
            expiresAt: {$gt: new Date()}
        });

        if (!pendingLogin || !loginRequest || pendingLogin.status !== 'approved') {
            return res.status(401).json({
                success: false,
                message: 'Login not approved or expired'
            });
        }

        req.session.userId = loginRequest.userId;
        pendingLogins.delete(confirmationToken);

        res.json({
            success: true,
            message: 'Login successful',
            token: pendingLogin.token,
            user: {
                id: loginRequest.userId,
                email: pendingLogin.email
            }
        });

    } catch (error) {
        console.error('Login completion error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.getPendingLogins = async (req, res) => {
    try {
        const userId = req.user.id;

        const pendingRequests = await LoginRequest.find({
            userId,
            status: 'pending',
            expiresAt: {$gt: new Date()}
        }).sort({createdAt: -1});

        res.json({
            success: true,
            pendingLogins: pendingRequests
        });

    } catch (error) {
        console.error('Get pending logins error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

async function getUserPushTokens(userId) {
  const records = await PushNotificationModel.find({ user: userId });
  return records.map(record => record.token);
}

async function sendPushNotification(userId, notification) {
  try {
    const userTokens = await getUserPushTokens(userId);

    if (!userTokens || userTokens.length === 0) {
      console.warn(`No push tokens found for user ${userId}`);
      return false;
    }

    const messages = userTokens.map(token => ({
      to: token,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    }));

    console.log(`Sending push notification to user ${userId}:`, messages);

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Expo push response:', result);

    return result?.data?.every(item => item.status === 'ok');
  } catch (error) {
    console.error('Push notification error:', error);
    return false;
  }
};
var UserModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
    var id = req.params.id;

    // Find the user by ID and populate the `postedBy` field to get the user details
    UserModel.findOne({ _id: id })
        .populate('postedBy')  // This will populate the `postedBy` field
        .exec(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            // If the population of `postedBy` is successful, it will be included in the `user` object
            return res.json(user);
        });
    },    

    /**
     * userController.create()
     */
    create: function (req, res) {
        
        UserModel.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        }, function (err, existingUser) {
            if (err) {
                return res.status(500).json({
                    message: 'Error checking existing user',
                    error: err
                });
            }

            if (existingUser) {
                return res.status(301).json({
                    message: 'User already exists'
                });
            }

            var user = new UserModel({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }

                return res.status(201).json(user);
            });
        });

    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function(req, res){
        res.render('user/register');
    },

    showLogin: function(req, res){
        res.render('user/login');
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or paassword');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            //res.redirect('/users/profile');
            return res.json(user);
        });
    },

    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    //return res.render('user/profile', user);
                    return res.json(user);
                }
            }
        });
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    //return res.redirect('/');
                    return res.status(201).json({});
                }
            });
        }
    },
    appLogin: function (req, res, next) {
        const { username, password } = req.body;

        UserModel.authenticate(username, password, function (err, user) {
            if (err || !user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
            }

            const payload = { id: user._id, username: user.username };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });

            return res.status(200).json({ token, user: payload });
        });
    },

    appLogout: function(req, res){
         if(req.session){
            req.session.destroy(function(err){
              return res.status(200).json({});
            });
        }
    },
   appValidation: async function (req, res) {
        try {
            console.log('Received appValidation request');
            console.log('req.user:', req.user);

            const userId = req.user?.id || req.user?._id;
            console.log('Extracted userId:', userId);

            if (!userId) {
            console.log('User ID missing in token');
            return res.status(400).json({ error: 'User ID missing in token' });
            }

            const user = await UserModel.findById(userId).exec();

            if (!user) {
            console.log('User not found for id:', userId);
            return res.status(404).json({ error: 'User not found' });
            }

            console.log('User found:', user);
            return res.json(user);
        } catch (err) {
            console.error('Unhandled error in appValidation:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

};

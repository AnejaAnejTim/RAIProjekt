var express = require('express');
var router = express.Router();
var recipeController = require('../controllers/recipeController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        console.log(req.session)
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', recipeController.list);

/*
 * GET
 */
router.get('/:id', recipeController.show);

/*
 * POST
 */
router.post('/', requiresLogin, recipeController.create);

/*
 * PUT
 */
router.put('/:id', recipeController.update);

/*
 * DELETE
 */
router.delete('/:id', recipeController.remove);

module.exports = router;

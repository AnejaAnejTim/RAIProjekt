var express = require('express');
var router = express.Router();
var fridgeController = require('../controllers/fridgeController.js');
const requireAuth = require('../middleware/auth.js');

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

/*
 * GET
 */
router.get('/',requiresLogin, fridgeController.show);

/*
 * POST
 */
router.post('/', requiresLogin, fridgeController.create);
router.post('/barcodeScan', requireAuth, fridgeController.createFromBarcode);
/*
 * PUT
 */
router.put('/:id', requiresLogin, fridgeController.update);

/*
 * DELETE
 */
router.delete('/:id', requiresLogin, fridgeController.remove);

module.exports = router;

var express = require('express');
var router = express.Router();
var recipeController = require('../controllers/recipeController.js');

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
router.post('/', recipeController.create);

/*
 * PUT
 */
router.put('/:id', recipeController.update);

/*
 * DELETE
 */
router.delete('/:id', recipeController.remove);

module.exports = router;

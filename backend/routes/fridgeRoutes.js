var express = require('express');
var router = express.Router();
var fridgeController = require('../controllers/fridgeController.js');

/*
 * GET
 */
router.get('/', fridgeController.list);

/*
 * GET
 */
router.get('/:id', fridgeController.show);

/*
 * POST
 */
router.post('/', fridgeController.create);

/*
 * PUT
 */
router.put('/:id', fridgeController.update);

/*
 * DELETE
 */
router.delete('/:id', fridgeController.remove);

module.exports = router;

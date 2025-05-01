var express = require('express');
var router = express.Router();
var barcodeController = require('../controllers/barcodeController.js');

/*
 * GET
 */
router.get('/', barcodeController.list);

/*
 * GET
 */
router.get('/:id', barcodeController.show);

/*
 * POST
 */
router.post('/', barcodeController.create);

/*
 * PUT
 */
router.put('/:id', barcodeController.update);

/*
 * DELETE
 */
router.delete('/:id', barcodeController.remove);

module.exports = router;

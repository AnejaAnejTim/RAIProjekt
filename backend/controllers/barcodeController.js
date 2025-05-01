var BarcodeModel = require('../models/barcodeModel.js');

/**
 * barcodeController.js
 *
 * @description :: Server-side logic for managing barcodes.
 */
module.exports = {

    /**
     * barcodeController.list()
     */
    list: function (req, res) {
        BarcodeModel.find(function (err, barcodes) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting barcode.',
                    error: err
                });
            }

            return res.json(barcodes);
        });
    },

    /**
     * barcodeController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        BarcodeModel.findOne({_id: id}, function (err, barcode) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting barcode.',
                    error: err
                });
            }

            if (!barcode) {
                return res.status(404).json({
                    message: 'No such barcode'
                });
            }

            return res.json(barcode);
        });
    },

    /**
     * barcodeController.create()
     */
    create: function (req, res) {
        var barcode = new BarcodeModel({
			code : req.body.code,
			product_name : req.body.product_name,
			brand : req.body.brand,
			weight : req.body.weight
        });

        barcode.save(function (err, barcode) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating barcode',
                    error: err
                });
            }

            return res.status(201).json(barcode);
        });
    },

    /**
     * barcodeController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        BarcodeModel.findOne({_id: id}, function (err, barcode) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting barcode',
                    error: err
                });
            }

            if (!barcode) {
                return res.status(404).json({
                    message: 'No such barcode'
                });
            }

            barcode.code = req.body.code ? req.body.code : barcode.code;
			barcode.product_name = req.body.product_name ? req.body.product_name : barcode.product_name;
			barcode.brand = req.body.brand ? req.body.brand : barcode.brand;
			barcode.weight = req.body.weight ? req.body.weight : barcode.weight;
			
            barcode.save(function (err, barcode) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating barcode.',
                        error: err
                    });
                }

                return res.json(barcode);
            });
        });
    },

    /**
     * barcodeController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        BarcodeModel.findByIdAndRemove(id, function (err, barcode) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the barcode.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};

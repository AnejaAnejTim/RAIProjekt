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
        var code = req.params.id;

        BarcodeModel.findOne({code: code}, function (err, barcode) {
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
        const { code, product_name, weight, unit, brand } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Barcode "code" is required.' });
        }

        BarcodeModel.findOne({ code: code }, function (err, existingBarcode) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when finding barcode.',
                    error: err
                });
            }

            if (!existingBarcode) {
                const newBarcode = new BarcodeModel({
                    code,
                    product_name,
                    weight,
                    unit,
                    brand
                });

                newBarcode.save(function (err, savedBarcode) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating barcode.',
                            error: err
                        });
                    }

                    return res.status(201).json(savedBarcode);
                });
            } else {
                existingBarcode.code = code || existingBarcode.code;
                existingBarcode.product_name = product_name || existingBarcode.product_name;
                existingBarcode.brand = brand || existingBarcode.brand;
                existingBarcode.weight = weight || existingBarcode.weight;
                existingBarcode.unit = unit || existingBarcode.unit;

                existingBarcode.save(function (err, updatedBarcode) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating barcode.',
                            error: err
                        });
                    }

                    return res.json(updatedBarcode);
                });
            }
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

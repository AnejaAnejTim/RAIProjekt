var FridgeModel = require('../models/fridgeModel.js');

/**
 * fridgeController.js
 *
 * @description :: Server-side logic for managing fridges.
 */
module.exports = {

    /**
     * fridgeController.list()
     */
    list: function (req, res) {
        FridgeModel.find(function (err, fridges) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting fridge.',
                    error: err
                });
            }

            return res.json(fridges);
        });
    },

    /**
     * fridgeController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        FridgeModel.findOne({_id: id}, function (err, fridge) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting fridge.',
                    error: err
                });
            }

            if (!fridge) {
                return res.status(404).json({
                    message: 'No such fridge'
                });
            }

            return res.json(fridge);
        });
    },

    /**
     * fridgeController.create()
     */
    create: function (req, res) {
        var fridge = new FridgeModel({
			item_name : req.body.item_name,
			quantity : req.body.quantity,
			expiration : req.body.expiration,
			barcode : req.body.barcode,
			addedOn : req.body.addedOn,
			user : req.body.user
        });

        fridge.save(function (err, fridge) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating fridge',
                    error: err
                });
            }

            return res.status(201).json(fridge);
        });
    },

    /**
     * fridgeController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        FridgeModel.findOne({_id: id}, function (err, fridge) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting fridge',
                    error: err
                });
            }

            if (!fridge) {
                return res.status(404).json({
                    message: 'No such fridge'
                });
            }

            fridge.item_name = req.body.item_name ? req.body.item_name : fridge.item_name;
			fridge.quantity = req.body.quantity ? req.body.quantity : fridge.quantity;
			fridge.expiration = req.body.expiration ? req.body.expiration : fridge.expiration;
			fridge.barcode = req.body.barcode ? req.body.barcode : fridge.barcode;
			fridge.addedOn = req.body.addedOn ? req.body.addedOn : fridge.addedOn;
			fridge.user = req.body.user ? req.body.user : fridge.user;
			
            fridge.save(function (err, fridge) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating fridge.',
                        error: err
                    });
                }

                return res.json(fridge);
            });
        });
    },

    /**
     * fridgeController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        FridgeModel.findByIdAndRemove(id, function (err, fridge) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the fridge.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};

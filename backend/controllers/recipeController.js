var RecipeModel = require('../models/recipeModel.js');

/**
 * recipeController.js
 *
 * @description :: Server-side logic for managing recipes.
 */
module.exports = {

    /**
     * recipeController.list()
     */
    list: function (req, res) {
        RecipeModel.find(function (err, recipes) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting recipe.',
                    error: err
                });
            }

            return res.json(recipes);
        });
    },

    /**
     * recipeController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RecipeModel.findOne({_id: id}, function (err, recipe) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting recipe.',
                    error: err
                });
            }

            if (!recipe) {
                return res.status(404).json({
                    message: 'No such recipe'
                });
            }

            return res.json(recipe);
        });
    },

    /**
     * recipeController.create()
     */
    create: function (req, res) {
        var recipe = new RecipeModel({
			title : req.body.title,
			description : req.body.description,
			description : req.body.description,
			prep_time : req.body.prep_time,
			cook_time : req.body.cook_time
        });

        recipe.save(function (err, recipe) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating recipe',
                    error: err
                });
            }

            return res.status(201).json(recipe);
        });
    },

    /**
     * recipeController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RecipeModel.findOne({_id: id}, function (err, recipe) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting recipe',
                    error: err
                });
            }

            if (!recipe) {
                return res.status(404).json({
                    message: 'No such recipe'
                });
            }

            recipe.title = req.body.title ? req.body.title : recipe.title;
			recipe.description = req.body.description ? req.body.description : recipe.description;
			recipe.description = req.body.description ? req.body.description : recipe.description;
			recipe.prep_time = req.body.prep_time ? req.body.prep_time : recipe.prep_time;
			recipe.cook_time = req.body.cook_time ? req.body.cook_time : recipe.cook_time;
			
            recipe.save(function (err, recipe) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating recipe.',
                        error: err
                    });
                }

                return res.json(recipe);
            });
        });
    },

    /**
     * recipeController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RecipeModel.findByIdAndRemove(id, function (err, recipe) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the recipe.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};

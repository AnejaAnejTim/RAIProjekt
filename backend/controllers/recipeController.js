var RecipeModel = require('../models/recipeModel.js');
var FridgeModel = require('../models/fridgeModel.js');
var openai = require('../openai');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/recipes/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 5MB limit
    }
});

/**
 * recipeController.js
 *
 * @description :: Server-side logic for managing recipes.
 */
module.exports = {

    // Multer middleware for handling uploads
    uploadImages: upload.array('images', 5), // Allow up to 5 images

    /**
     * recipeController.list()
     */
    list: async function (req, res) {
        try {
            const recipes = await RecipeModel.find()
                .populate('user', 'username')
                .sort({views: -1});
            res.json(recipes);
        } catch (err) {
            res.status(500).json({message: 'Error when getting recipes.', error: err});
        }
    },

    /**
     * recipeController.show()
     */
// backend/controllers/recipeController.js

    show: async function (req, res) {
        try {
            const recipe = await RecipeModel.findById(req.params.id)
                .populate('user', 'username')
                .lean();

            if (!recipe) {
                return res.status(404).json({message: 'No such recipe'});
            }

            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
            res.set('Surrogate-Control', 'no-store');

            if (req.session && req.session.userId) {
                const alreadyViewed = (recipe.viewedBy || []).some(
                    entry => entry.user.toString() === req.session.userId
                );
                if (!alreadyViewed) {
                    await RecipeModel.findByIdAndUpdate(
                        req.params.id,
                        {
                            $push: {viewedBy: {user: req.session.userId, date: new Date()}},
                            $inc: {views: 1}
                        }
                    );
                    recipe.views = (recipe.views || 0) + 1;
                    recipe.viewedBy = [...(recipe.viewedBy || []), {user: req.session.userId, date: new Date()}];
                }
            }

            if (recipe.mainImage) {
                recipe.image = `${req.protocol}://${req.get('host')}/recipes/images/${recipe.mainImage}`;
            }

            res.json(recipe);
        } catch (err) {
            res.status(500).json({message: 'Error when getting recipe.', error: err});
        }
    },

    showMyRecipes: function (req, res) {
        const user = req.session.userId;

        if (!user) {
            return res.status(401).json({message: "Unauthorized: No user in session."});
        }

        RecipeModel.find({user: user}, function (err, recipes) {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    message: 'Error when getting recipes.',
                    error: err
                });
            }

            if (!recipes || recipes.length === 0) {
                return res.status(404).json({
                    message: 'No recipes found.'
                });
            }

            return res.status(200).json(recipes);
        });
    },

    /**
     * recipeController.create()
     */
    create: async function (req, res) {
          var user = req.session.userId;
          var filters = req.body.filters;
          var ingredientsIds = req.body.ingredients;
          var ingredients = await FridgeModel.find({
              '_id': { $in: ingredientsIds }  
          });

          ingredients = ingredients.map(ingredient => ({
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit
          }));

          const msg = `
          Ti si pametni pomočnik za generiranje receptov.

          Na podlagi spodnjih sestavin in filtrov ustvari en (1) recept za kosilo v slovenščini. 
          Lahko uporabiš osnovne sestavine kot so sol, poper, olje, kis, ipd., vendar ne dodajaj večjih novih živil.
          Ni potrebno uporabiti vseh sestavin ali celotne količine.

          Vrni izključno naslednje razdelke:
          - Naslov recepta
          - Čas priprave (npr: "10 minut")
          - Čas kuhanja (npr: "20 minut")
          - Sestavine (v enem nizu, npr: "jajca 2 kosa, mleko 150 ml, sol 1/2 čajne žličke")
          - Navodila (ločena s piko)

          Sestavine:
          ${ingredients.map(i => `${i.name} ${i.quantity} ${i.unit}`).join(", ")}

          Tip obroka: ${filters.mealType}
          Uporabi lahko druge sestavine: ${filters.canUseOtherIngredients ? "Da" : "Ne"}

          Primer izpisa formata:
          {
            "recipeTitle": "Jajca",
            "prepTime": "5 minut",
            "cookTime": "10 minut",
            "ingredients": "jajca 2 kosa, mleko 150 ml, sol 1/2 čajne žličke, poper 1/2 čajne žličke",
            "instructions": "Jajca, mleko, sol in poper stepite v skledi.\nSegrejte nelepljivo ponev na srednji temperaturi.\nDodajte maslo v ponev; zavrtite, da se porazdeli\n.Vlijte mešanico jajc v ponev; kuhajte 2 minuti ali dokler skoraj ne bo postavljeno.\nPrevidno dvignite robove omlete s lopatico in nagnite ponev, da omogočite, da se nekuhana zmes izlije pod dno.\nKuhajte še 1 minuto ali dokler ni popolnoma postavljeno.\nZložite omleto na pol.\nZdrsnete jo na krožnik.\nPostrezite takoj."
          }
          `;
          try {
            const response = await openai.chat.completions.create({
              model: "gpt-4.1",
              messages: [{role: "user", content: msg}],
            });

            const recipeRes = JSON.parse(response.choices[0].message.content);

            const ingredientsArray = recipeRes.ingredients
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);

            var recipe = new RecipeModel({
              user: user,
              title: recipeRes.recipeTitle,
              description: recipeRes.instructions,
              ingredients: ingredientsArray, 
              prep_time: recipeRes.prepTime,
              cook_time: recipeRes.cookTime
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
          } catch (err) {
            console.log(err);
            return res.status(500).json({
              message: "Error with OpenAI API",
              error: err,
            });
          }
        },

            const recipeRes = JSON.parse(response.choices[0].message.content);

            // Split the ingredients string by commas and trim to get array of strings
            const ingredientsArray = recipeRes.ingredients
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

            // Process uploaded images
            let images = [];
            let mainImage = null;

            if (req.files && req.files.length > 0) {
                images = req.files.map(file => ({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size
                }));

                mainImage = req.files[0].filename;
            }

            var recipe = new RecipeModel({
                user: user,
                title: recipeRes.recipeTitle,
                description: recipeRes.instructions,
                ingredients: ingredientsArray,
                prep_time: recipeRes.prepTime,
                cook_time: recipeRes.cookTime,
                images: images,
                images: images,
                mainImage: mainImage
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
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error with OpenAI API",
                error: err,
            });
        }
    },

    // backend/controllers/recipeController.js

    update: async function (req, res) {
        try {
            const id = req.params.id;
            const recipe = await RecipeModel.findById(id);

            if (!recipe) {
                return res.status(404).json({message: 'No such recipe'});
            }

            // Update fields
            recipe.title = req.body.title ?? recipe.title;
            recipe.description = req.body.description ?? recipe.description;
            recipe.prep_time = req.body.prep_time ?? recipe.prep_time;
            recipe.cook_time = req.body.cook_time ?? recipe.cook_time;

            if (req.body.ingredients) {
                if (typeof req.body.ingredients === 'string') {
                    recipe.ingredients = req.body.ingredients
                        .split(/,|\n/)
                        .map(s => s.trim())
                        .filter(Boolean);
                } else if (Array.isArray(req.body.ingredients)) {
                    recipe.ingredients = req.body.ingredients;
                }
            }

            // Handle new image uploads
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => ({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size
                }));

                recipe.images = recipe.images.concat(newImages);

                // Always set mainImage to the first new image if uploaded
                recipe.mainImage = newImages[0].filename;
            } else if (req.body.mainImage) {
                recipe.mainImage = req.body.mainImage;
            }

            await recipe.save();

            // Populate user and add image URL
            const updatedRecipe = await RecipeModel.findById(recipe._id)
                .populate('user', 'username')
                .lean();

            if (updatedRecipe.mainImage) {
                updatedRecipe.image = `${req.protocol}://${req.get('host')}/recipes/images/${updatedRecipe.mainImage}`;
            }

            return res.json(updatedRecipe);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating recipe.',
                error: err
            });
        }
    },

    /**
     * Delete a specific image from a recipe
     */
    deleteImage: function (req, res) {
        const recipeId = req.params.id;
        const imageFilename = req.params.filename;

        RecipeModel.findById(recipeId, function (err, recipe) {
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

            const imageIndex = recipe.images.findIndex(img => img.filename === imageFilename);

            if (imageIndex === -1) {
                return res.status(404).json({
                    message: 'Image not found'
                });
            }

            const imagePath = recipe.images[imageIndex].path;

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });

            recipe.images.splice(imageIndex, 1);

            if (recipe.mainImage === imageFilename) {
                recipe.mainImage = recipe.images.length > 0 ? recipe.images[0].filename : null;
            }

            recipe.save(function (err, updatedRecipe) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating recipe.',
                        error: err
                    });
                }
                return res.json(updatedRecipe);
            });
        });
    },

    /**
     * recipeController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RecipeModel.findById(id, function (err, recipe) {
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

            // Delete all associated images
            if (recipe.images && recipe.images.length > 0) {
                recipe.images.forEach(image => {
                    fs.unlink(image.path, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                });
            }

            RecipeModel.findByIdAndRemove(id, function (err, recipe) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the recipe.',
                        error: err
                    });
                }

                return res.status(204).json();
            });
        });
    },

    // backend/controllers/recipeController.js

    trending: async function (req, res) {
        try {
            const recipes = await RecipeModel.find()
                .populate('user', 'username')
                .sort({ views: -1 })
                .limit(6)
                .lean();

            res.json(recipes);
        } catch (err) {
            console.error('Trending error:', err);
            res.status(500).json({message: 'Error when getting trending recipes.', error: err});
        }
    }
};
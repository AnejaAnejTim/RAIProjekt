var RecipeModel = require('../models/recipeModel.js');
var FridgeModel = require('../models/fridgeModel.js');
var openai = require('../openai')
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
        - Navodila (v oštevilčenih korakih)

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
        "instructions": "1. Jajca, mleko, sol in poper stepite v skledi. 2. Segrejte nelepljivo ponev na srednji temperaturi. 3. Dodajte maslo v ponev; zavrtite, da se porazdeli. 4. Vlijte mešanico jajc v ponev; kuhajte 2 minuti ali dokler skoraj ne bo postavljeno. 5. Previdno dvignite robove omlete s lopatico in nagnite ponev, da omogočite, da se nekuhana zmes izlije pod dno. 6. Kuhajte še 1 minuto ali dokler ni popolnoma postavljeno. 7. Zložite omleto na pol. 8. Zdrsnete jo na krožnik. 9. Postrezite takoj."
        }
        `;

        try {
            const response = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{role: "user", content: msg}],
        });
            recipeRes = JSON.parse(response.choices[0].message.content);
            console.log
            var recipe = new RecipeModel({
                user: user,
                title : recipeRes.recipeTitle,
                description : recipeRes.instructions,
                ingredients : recipeRes.ingredients,
                prep_time : recipeRes.prepTime,
                cook_time : recipeRes.cookTime
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
     
        
        
        /*
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
        */
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

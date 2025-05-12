var FridgeModel = require("../models/fridgeModel.js");
var openai = require('../openai')
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
    FridgeModel.find().exec(function (err, fridges) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting fridge.",
          error: err,
        });
      }

      return res.json(fridges);
    });
  },

  /**
   * fridgeController.show()
   */
  show: function (req, res) {
    var user = req.session.userId

    FridgeModel.find({ user: user }, function (err, fridge) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting fridge.",
          error: err,
        });
      }

      if (!fridge) {
        return res.status(404).json({
          message: "No such fridge",
        });
      }

      return res.json(fridge);
    });
  },

  /**
   * fridgeController.create()
   */
  create: async function (req, res) {
    var user = req.session.userId;
    var ingredients = req.body;


    if (!Array.isArray(ingredients)) {
      return res
        .status(400)
        .json({ error: "Expected an array of ingredients" });
    }

  
    const msg = 'Respond the same ONLY json (you can fix any typos, but get to the closest edible food, dont assume that the item is named like the icons) only add the best fitting icon (like icon : ) from this list: faCarrot, faFish, faCheese, faEgg, faBreadSlice, faAppleAlt, faDrumstickBite, faPepperHot, faLeaf, faBacon, faCookie, faLemon, faIceCream, faPizzaSlice, faHamburger, faHotdog, faSeedling, faBottleWater, faWineBottle, faMugHot. Remove any non-edible items (do not remove edible alcohol) from the list: ' + JSON.stringify(ingredients);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }],
      });

      ingredients = JSON.parse(response.choices[0].message.content);
      for (const ingredient of ingredients) {
        var fridge = new FridgeModel({
          name: String(ingredient.name).charAt(0).toUpperCase() + String(ingredient.name).slice(1),
          unit: ingredient.unit,
          quantity: ingredient.quantity,
          icon: ingredient.icon,
          expiration: ingredient.expiration,
          addedOn: new Date(),
          user: user,
        });

        try {
          await fridge.save();
        } catch (err) {
          return res.status(500).json({
            message: "Error when creating fridge",
            error: err,
          });
        }
      }

      return res.status(201).json({ message: "Ingredients added successfully" });

    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error with OpenAI API",
        error: err,
      });
    }


    /*
        var fridge = new FridgeModel({
      item_name : req.body.item_name,
      quantity : req.body.quantity,
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
        */
  },

  /**
   * fridgeController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    FridgeModel.findOne({ _id: id }, function (err, fridge) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting fridge",
          error: err,
        });
      }

      if (!fridge) {
        return res.status(404).json({
          message: "No such fridge",
        });
      }

      fridge.item_name = req.body.item_name
        ? req.body.item_name
        : fridge.item_name;
      fridge.quantity = req.body.quantity ? req.body.quantity : fridge.quantity;
      fridge.expiration = req.body.expiration
        ? req.body.expiration
        : fridge.expiration;
      fridge.barcode = req.body.barcode ? req.body.barcode : fridge.barcode;
      fridge.addedOn = req.body.addedOn ? req.body.addedOn : fridge.addedOn;
      fridge.user = req.body.user ? req.body.user : fridge.user;

      fridge.save(function (err, fridge) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating fridge.",
            error: err,
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
          message: "Error when deleting the fridge.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};

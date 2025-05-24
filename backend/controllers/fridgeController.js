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

    FridgeModel.find({user: user}, function (err, fridge) {
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
        .json({error: "Expected an array of ingredients"});
    }


    const msg = `
    Odgovori IZKLJUČNO z veljavnim JSON array-em (brez oznak kot so \`\`\`json ali dodatnih razlag).

    Vsak objekt naj vsebuje naslednje lastnosti:
    - "name": točno takšno kot je v vhodu (brez prevodov ali sprememb),
    - "icon": najbolj ustrezna ikona iz DOVOLJENIH ikon spodaj (vedno ENA, brez dodajanja drugih lastnosti).

    DOVOLJENE IKONE:
    [faCarrot, faFish, faCheese, faEgg, faBreadSlice, faAppleAlt, faDrumstickBite, faPepperHot, faLeaf, faBacon, faCookie, faLemon, faIceCream, faPizzaSlice, faHamburger, faHotdog, faSeedling, faBottleWater, faWineBottle, faMugHot]

    PRAVILA:
    1. Imena ("name") naj ostanejo popolnoma nespremenjena.
    2. Ohrani vse dodatne lastnosti kot so "quantity", "unit", "addedOn", če obstajajo.
    3. Odstrani vse neužitne artikle (npr. osebe, države, predmete kot so plastika, papir, detergent, truplo, Slovenija, Andrejc itd.).
    4. Ne odstranjuj užitnih sestavin kot so sushi kis, jušne kocke, alkohol itd.
    5. Če se enaka sestavina ponovi, mora vedno imeti enako ikono.
    6. Ne dodaj komentarjev ali dodatnih besed. Odgovori samo z JSON array-em.

    Vhodni podatki:
    ${JSON.stringify(ingredients)}
    `;
    console.log(ingredients)
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{role: "user", content: msg}],
      });
      console.log(response.choices[0].message.content);
      ingredients = JSON.parse(response.choices[0].message.content);

      console.log(ingredients)
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

      return res.status(201).json({message: "Ingredients added successfully"});

    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error with OpenAI API",
        error: err,
      });
    }
  },

  update: async function (req, res) {
    var id = req.params.id;
    var updateData = req.body;
    var user = req.session.userId;

    try {
      
      const updatedFridge = await FridgeModel.findOneAndUpdate(
        {_id: id, user: user},
        updateData,
        {new: true}
      );

      if (!updatedFridge) {
        return res.status(404).json({message: "Fridge item not found or unauthorized"});
      }

      return res.status(200).json(updatedFridge);
    } catch (err) {
      return res.status(500).json({
        message: "Error when updating the fridge item",
        error: err,
      });
    }
  },

  createFromBarcode: async function (req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: no user info found' });
    }

    const ingredient = req.body;

    ingredient.name =
      String(ingredient.name).charAt(0).toUpperCase() +
      String(ingredient.name).slice(1);

    const fridge = new FridgeModel({
      name: ingredient.name,
      unit: ingredient.unit || '',
      quantity: ingredient.quantity || '',
      icon: "faBarcode",
      expiration: ingredient.expiration || null,
      addedOn: new Date(),
      user: userId,
    });

    await fridge.save();

    return res.status(201).json({ message: "Ingredient added successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || err,
      error: err,
    });
  }
}
,


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

  deleteMultipleItems: function(req, res) {
  const ids = req.body.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No IDs provided for deletion." });
  }

  FridgeModel.deleteMany({ _id: { $in: ids } }, function(err) {
    if (err) {
      return res.status(500).json({
        message: "Error when deleting multiple items.",
        error: err,
      });
    }
    return res.status(204).json();
  });
},

};

var express = require('express');
var router = express.Router();
var openai = require('../openai')
/* GET home page. */
router.get('/', async (req, res) => {
  msg = 'I have eggs, flour, sugar, milk, vanilla, oil. What can I make with that, I have spices. No need to use every ingredient or all of the amount STICK TO THE INGREDIENTS PROVIDED! Respond with the title of the recipe, ingredient list and instructions only. example of response: "recipeTitle": "Eggs","ingredients": "eggs 2 pc, milk 150 ml, salt 1/2 tsp, pepper 1/2 tsp","instructions": "1. Beat eggs, milk, salt, and pepper in a bowl. 2. Heat a nonstick skillet over medium heat. 3. Add butter to pan; swirl to coat. 4. Pour egg mixture into pan; cook 2 minutes or until almost set. 5. Gently lift edges of omelet with a spatula, tilting pan to allow uncooked portion to flow underneath. 6. Cook 1 minute or until set. 7. Fold omelet in half. 8. Slide onto a plate. 9. Serve immediately."'

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }],
    });
    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();
var openai = require('../openai')
/* GET home page. */
router.get('/', async (req, res) => {
  const userMessage = req.query.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Missing 'message' query parameter" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

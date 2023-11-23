const router = require("express").Router();
const withAuth = require('../../utils/auth')

const { Ingredients } = require("../../models");

router.post('/', withAuth,  async (req, res) => {

    try {
      const newIngredient = await Ingredients.create(req.body)
      if (newIngredient) {
        return res.status(201).json(newIngredient)
      }
    } catch (err) {
      return res.status(404).json(err)
    }
  
  });

  module.exports = router;
  
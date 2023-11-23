const router = require("express").Router();
const withAuth = require('../../utils/auth')
const { Recipe, Category, Ingredients } = require("../../models");

router.get("/", withAuth, async (req, res) => {
    try {
      const categoryData = await Category.findAll({
        include: {
          model: Recipe,
          required: true
      }
      });
      if (categoryData) {
      res.status(200).json(categoryData);
      } else {
        return res.status(404).json(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  module.exports = router;




  
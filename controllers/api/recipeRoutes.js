const router = require("express").Router();
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth')

const { Recipe, Category, Users, Ingredients } = require("../../models");

router.get("/", withAuth, async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      include: [
        {
          model: Category,
          attributes: ["id"],
        },
        {
          model: Users,
          attribute: ["id"],
        },
      ],
    });
    if (recipeData) {
      res.status(200).json(recipeData);
    } else {
      return res.status(404).json(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", withAuth, async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ["id"],
        },
        {
          model: Users,
          attribute: ["id"],
        },
      ],
    });
    if (recipeData) {
      res.status(200).json(recipeData);
    } else {
      return res.status(404).json(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const delId = await Recipe.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (delId) {
      return res.status(200).json({ delId });
    } else {
      return res.status(404).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", withAuth, async (req, res) => {
  try {

    const ingredientDetails = req.body.ingredients;

    const newRecipe = await Recipe.create(
     
      {
        name: req.body.name,
        instructions: req.body.instructions,
        category_id: req.body.category_id,
        user_id: req.session.user_id,
      },
      {
        include: [Ingredients]
      }
    );

      if (ingredientDetails && ingredientDetails.length > 0) {
        const createdIngredients = await Ingredients.bulkCreate(
          ingredientDetails.map((ingredient) => ({
            ingredient: ingredient.name,
            measurement: ingredient.measure,
            unit: ingredient.unit,
            recipe_id: newRecipe.id,
          }))
        );
      
        await newRecipe.addIngredients(createdIngredients);
      }

 

    if (newRecipe) {
      return res.status(201).json(newRecipe);
    }
  } catch (err) {
    return res.status(404).json(err);
  }
});


router.put("/:id", withAuth, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log(req.body);
    const upRec = await Recipe.update(
      {
        name: req.body.name,
        instructions: req.body.instructions,
        category_id: req.body.category_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.log("deleting");
    await Ingredients.destroy({
      where: {
        recipe_id: req.params.id,
      },
    });
    console.log("deletion complete");
    const ingredientDetails = req.body.ingredients;
    if (ingredientDetails && ingredientDetails.length > 0) {
      console.log("preparing");
      const createdIngredients = await Ingredients.bulkCreate(
        ingredientDetails.map((ingredient) => ({
          ingredient: ingredient.ingredient,
          measurement: ingredient.measurement,
          unit: ingredient.unit,
          recipe_id: req.params.id,
        }))
      );
      console.log("updating");
      await t.commit();
      console.log("done");
    }

    return res.status(200).json({"ok": true});
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json(err);
  }
});

module.exports = router;

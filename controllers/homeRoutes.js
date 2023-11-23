/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Sonja Gorin, Jacob Martin, Gustavo Miller
 * Licensed under MIT
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Date : 11/14/2023 5:50:29 PM
 *******************************************************************/
const router = require("express").Router();
const { Users, Category, Recipe, Ingredients } = require("../models");
const withAuth = require("../utils/auth");
const dic = require("../db/queries"); // Collection of SQL queries
const notifier = require('node-notifier');

router.get('/', async (req, res) => {
     res.render('hero', {
          logged_in: req.session.logged_in,
          user_name: req.session.user_name,
     });
});

/**
 * Login route - user will be presented with login screen to 
 * enter their credentials
 */
router.get('/login', (req, res) => {
     if (req.session.logged_in) {
          res.redirect('/');
          return;
     }

     res.render('login');
});

/**
 * This route will retrieve the recipes and pass them over to the list handlebars
 */
router.get('/list', withAuth, async (req, res) => {

     const dbData = await Recipe.findAll({
          include: { all: true, nested: true },
          attributes: { exclude: ['instructions'] },
          order: [["name", "ASC"]],
     });

     // This will serialize the data prior to send to handlebar. We are using list 
     // in this case as we are dealing with a bunch of records. 
     const handlebarData = dbData.map((list) => list.get({ plain: true }));

     if (handlebarData.length != 0) {
          
          req.session.origin_call = "list"; //Store call origin

          res.render('recipelist', {
               handlebarData,
               logged_in: req.session.logged_in,
               user_id: req.session.user_id,
               user_name: req.session.user_name,
               origin_call: req.session.origin_call,
               user_all: true,
          });

     }

});

/**
 * This route will retrieve the currently logged in recipes and pass them over to the 
 * list handlebars, same as Homeroute /list
 */
router.get('/memberlist', withAuth, async (req, res) => {

     const dbData = await Recipe.findAll({
          where: { user_id: req.session.user_id },
          include: { all: true, nested: true },
          attributes: { exclude: ['instructions'] },
          order: [["name", "ASC"]],
     });

     // This will serialize the data prior to send to handlebar. We are using list 
     // in this case as we are dealing with a bunch of records. 
     const handlebarData = dbData.map((list) => list.get({ plain: true }));
     const callingname = "memberlist";

     if (handlebarData.length != 0) {

          req.session.origin_call = "memberlist"; //Store call origin

          res.render('recipelist', {
               handlebarData,
               logged_in: req.session.logged_in,
               user_id: req.session.user_id,
               user_name: req.session.user_name,
               origin_call: req.session.origin_call,
               user_all: false,
          });
     }

});

/**
 * Register route - this will allow new users to register into our blog
 * database.
 */
router.get('/register', (req, res) => {
     if (req.session.logged_in) {
          alert(dic.messages.registernot);
          return;
     }

     res.render('register');
})

router.get('/create', async (req, res) => {

     try {
          const categoryData = await Category.findAll();

          const categories = categoryData.map(data => data.get({ plain: true }))



          if (req.session.logged_in) {
               res.render('add-recipe', {
                    categories
               });
          }
     } catch (err) {
          console.log(err);
          res.status(500).json(err);
     }

});

router.get('/view/:id', withAuth, async (req, res) => {
     try {
          const recipeData = await Recipe.findByPk(req.params.id, {
               include: [
                    {
                         model: Ingredients
                    },
                    {
                         model: Category
                    }
               ]
          });

          const recipe = recipeData.get({ plain: true });
          recipe.instructions = recipe.instructions.replace(/(?:\r\n|\r|\n)/g, '\\n');
          const isEditable = recipeData.user_id == req.session.user_id
          if (req.session.logged_in) {
               res.render('recipe', {
                    recipe, 
                    isEditable,
                    origin_call: req.session.origin_call,
               });

               notifier.notify({
                    title: "Cravings",
                    message: "We hope you enjoy this recipe!"
               });
          }

     } catch (err) {
          console.log(err);
          res.status(500).json(err);
     }

});

router.get('/edit/:id', withAuth, async (req, res) => {

     try {


          const recipeData = await Recipe.findByPk(req.params.id, {
               include: [
                    {
                         model: Ingredients
                    },
                    {
                         model: Category
                    }


               ]
          });


          const recipe = recipeData.get({ plain: true })

          const categoryData = await Category.findAll();
          const filteredCategories = categoryData.filter(category => category.id !== recipe.category_id)
          const categories = filteredCategories.map(data => data.get({ plain : true }))




          if (req.session.logged_in) {
               res.render('update-delete-recipe', {
                    recipe, categories
               });
          }
     } catch (err) {
          console.log(err);
          res.status(500).json(err);
     }

});





module.exports = router;

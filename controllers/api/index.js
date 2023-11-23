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
const router = require('express').Router();

const userRoutes = require('./userRoutes');
const recipeRoutes = require('./recipeRoutes')
const categoryRoutes = require('./categoryRoutes')
const ingredientRoutes = require('./ingredientRoutes')

router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes)
router.use('/categories', categoryRoutes)
router.use('/ingredients', ingredientRoutes)

module.exports = router;

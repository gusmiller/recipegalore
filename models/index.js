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
const Users = require("./user");
const Category = require("./category");
const Recipe = require("./recipe");
const Ingredients = require("./ingredients");


Category.hasMany(Recipe, {
     foreignKey: 'category_id'
     
})

Recipe.belongsTo(Category, {
     foreignKey: "category_id"
});


Users.hasMany(Recipe, {
     foreignKey: "user_id"
});


Recipe.belongsTo(Users, {
     foreignKey: "user_id"
});

// https://sequelize.org/docs/v6/advanced-association-concepts/creating-with-associations/
Recipe.Ingredients = Recipe.hasMany(Ingredients,{

     foreignKey: "recipe_id",
     onDelete: 'CASCADE'


})

module.exports = { Users, Category, Recipe, Ingredients };

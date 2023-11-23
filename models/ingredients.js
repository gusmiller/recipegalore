/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Sonja Gorin, Jacob Martin, Gustavo Miller
 * Licensed under MIT
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Model: Ingredients - Many to one relationship with Recipe
 * Date : 11/14/2023 5:50:29 PM
 *******************************************************************/

// The destructuring assignment syntax is a JavaScript expression that makes it 
// possible to unpack values from arrays, or properties from objects, into distinct variables
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const { Model, DataTypes, Sequelize } = require('sequelize');  //Destructuring imported data
const sequelize = require('../config/connection');

class Ingredients extends Model { }

Ingredients.init(
     {
          id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
          },
          ingredient: {
               type: DataTypes.STRING(100),
               allowNull: false,
          },
          unit: {
               type: DataTypes.STRING(25),
               allowNull: false,
          },
          measurement: {
               type: DataTypes.STRING(50),
               allowNull: false,
          },
          date_registered: {
               type: DataTypes.DATE,
               allowNull: false,
               defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          recipe_id:{
               type: DataTypes.INTEGER,
               allowNull: false,
               references:{
                    model: 'recipe',
                    key: 'id',
               }
          },
     },
     {
          sequelize,
          timestamps: false,
          freezeTableName: true,
          underscored: true,
          modelName: 'ingredient',
     }
);

module.exports = Ingredients;
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

// The destructuring assignment syntax is a JavaScript expression that makes it 
// possible to unpack values from arrays, or properties from objects, into distinct variables
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const { Model, DataTypes, Sequelize } = require('sequelize');  //Destructuring imported data

const sequelize = require('../config/connection');

// Initialize Post model (table) by extending off Sequelize's Model class
class Category extends Model { }

Category.init(
     {
          id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
          },
          name: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
          },
          date_created: {
               type: DataTypes.DATE,
               allowNull: false,
               defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          
     },
     {
          sequelize,
          timestamps: false,
          freezeTableName: true,
          underscored: true,
          modelName: 'category',
     }
);

module.exports = Category;
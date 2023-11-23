/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Sonja Gorin, Jacob Martin, Gustavo Miller
 * Licensed under MIT
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Model: Users
 * Date : 11/14/2023 5:50:29 PM
 *******************************************************************/

// The destructuring assignment syntax is a JavaScript expression that makes it 
// possible to unpack values from arrays, or properties from objects, into distinct variables
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const { Model, DataTypes, Sequelize } = require('sequelize');  //Destructuring imported data

// bcrypt is a password-hashing function designed by Niels Provos and David Mazières, 
// based on the Blowfish cipher and presented at USENIX in 1999
// https://en.wikipedia.org/wiki/Bcrypt
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');

class Users extends Model {
     checkPassword(loginPw) {
          return bcrypt.compareSync(loginPw, this.password);
     }
}

Users.init(
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
          },
          is_admin: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
          },
          status: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: true,
          },          
          email: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
               validate: {
                    isEmail: true,
               },
          },
          date_registered: {
               type: DataTypes.DATE,
               allowNull: false,
               defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          password: {
               type: DataTypes.STRING,
               allowNull: false,
               validate: {
                    len: [8],
               },
          },
     },
     {
          hooks: {
               beforeCreate: async (newUserData) => {
                    newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
               },
          },
          sequelize,
          timestamps: false,
          freezeTableName: true,
          underscored: true,
          modelName: 'user',
     }
);

module.exports = Users;
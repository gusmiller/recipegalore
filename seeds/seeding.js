/*******************************************************************
 * Carleton Bootcamp - 2023Ingredients
 * Copyright 2023 Sonja Gorin, Jacob Martin, Gustavo Miller
 * Licensed under MIT
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Date : 11/14/2023 5:50:29 PM
 *******************************************************************/
const { Users, Category } = require('../models'); //Seeding tables using bulkCreate
const messages = require("../utils/formatter");
const dic = require("../db/queries"); // Collection of SQL queries
const dbConnect = require("../config/newdb");

// Seeding files - array of components
const userData = require('./userData.json');
const categoryData = require('./categoryData.json');

var path = require("path");

// fs is a Node standard library package for reading and writing files
const fs = require("fs");

/**
 * This function will execute the SQL statement passed in parameters. The parameter is an
 * SQL file. These type of files are UTF-8 type of files an need to be read line-by-line
 * @param {string} value - SQL Statement to execute
 * @returns true/false
 */
async function executeSQL(value) {
     const connection = await dbConnect.connectmysql(process.env.DB_NAME); // Get connection to database

     try {
          for (let x = 0; x <= value.length - 1; x++) {

               if (value[x].length !== 0) {
                    console.log(value[x] + `;`);
                    await connection.execute(value[x]); //Execute SQL Statement
               }
          }
          return true;

     } catch (error) {
          console.log(dic.messages.executefailed + ` Error: ${error.stack}`);
          return false;
     } finally {
          connection.end(); // Close the database connection when done
     }
}

/**
 * Seed ALL - this asynchronous function will process the seeding of tables. There are two
 * types of seedings here; bulk from object and from SQL files, these are handy as we could 
 * have long files to import. Currently is dissabled.
 */
exports.seedAll = async () => {

     await Category.bulkCreate(categoryData);
     messages.msg(dic.messages.categoriesseeded, null, null, 80);

     await Users.bulkCreate(userData, { individualHooks: true, returning: true, });
     messages.msg(dic.messages.userseeded, null, null, 80);

     // The fs.readFileSync() method is an inbuilt application programming interface of 
     // the fs module which is used to read the file and return its content. 
     // https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
     let postsData = fs.readFileSync(path.resolve(__dirname, './recipeData.sql'), 'utf-8');

     // Import data directly from database. This uses a connection using MySQL npm package to 
     // connect database. The sql script needs to be parsed to avoid errors in syntax.
     // Important note: not all commands are supported, for example "use {database}" is not recognize
     parsedSQL = messages.parseSqlFile(postsData);

     try {
          const response = await executeSQL(parsedSQL); // Process SQL Statements
          if (response) {
               messages.msg(dic.messages.postsseeded, null, null, 80);

               // Retrieve next file: testing data for comments.
               postsData = fs.readFileSync(path.resolve(__dirname, './ingredietsData.sql'), 'utf-8');
               parsedSQL = messages.parseSqlFile(postsData)
               await executeSQL(parsedSQL); // Process SQL Statements
          }

     } catch (error) {
          console.log(dic.messages.customseedingfailed + ` Error: ${error.stack}`);
     }
};
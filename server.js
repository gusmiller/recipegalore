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
require('dotenv').config();

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const seeding = require("./seeds/seeding");
const path = require("path");

// Custom customized initialization
const messages = require("./utils/formatter")

const sequelize = require("./config/connection");

// Create a new sequelize store using the express-session package
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Instance of an Express Handlebars engine in a Node.js application using 
// express-handlebars library. 
const hbs = exphbs.create({ helpers });

// Configure and link a session object with the sequelize store
const sess = {
     secret: "pmaC ytisrevinU notelraC",
     cookie: {},
     resave: false,
     saveUninitialized: false,
     store: new SequelizeStore({
          db: sequelize
     })
};

// Add express-session and store as Express.js middleware
app.use(session(sess));

// his is an Express.js method that allows you to set up a template engine. A 
// template engine is a tool that allows you to embed dynamic content into 
// static templates. In the context of web development, it's often used to 
// generate HTML dynamically.
// hbs.engine - is the actual template engine. 
app.engine("handlebars", hbs.engine);

// Configure the view engine for the Express.js application. The second argument 
// sets the 'view engine' to 'handlebars' extension files.
app.set("view engine", "handlebars");

// Start of middleware section ************************

// This is a built-in middleware function in Express. It parses incoming requests 
// with JSON payloads and is based on body-parser.
// https://expressjs.com/en/5x/api.html
app.use(express.json());

// Returns middleware that only parses urlencoded bodies and only looks at requests 
// where the Content-Type header matches the type option. This parser accepts only 
// UTF-8 encoding of the body.
app.use(express.urlencoded({ extended: true }));

// Express.static: This is a middleware function in Express that serves static files. 
// Static files are files that don"t change frequently. In the context here it joins
// two or more paths to the content of __dirname.
app.use(express.static(path.join(__dirname, 'public')));

// End of middleware section **************************

app.use(routes); // Routing defined in the ./routes index.js
process.stdout.write("\x1Bc");

messages.figletMsg("Carleton U");
messages.figletMsg("Recipies Cravings");

sequelize.sync({ force: false }).then(() => {
     app.listen(PORT, () => {

          if (process.env.DB_SEED === "YES") {
               // Make sure we have initial data since database was deemed not valid
               sequelize.sync({ force: true })
                    .then(() => {

                         try {
                              seeding.seedAll(sequelize) // Time to seed data
                                   .then(() => {
                                        // This will display a message on terminal
                                        messages.apiendpoints();
                                        app.listen(PORT);
                                        process.exit();
                                   });
                         } catch (err) {
                              console.log(err);
                         }

                    });

          }
          messages.apiendpoints();
     });

});
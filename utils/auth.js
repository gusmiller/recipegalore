/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Sonja Gorin, Jacob Martin, Gustavo Miller
 * Licensed under MIT
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Date : 11/14/2023 5:50:29 PM
 * Purpose: This helper will validate whether the user is logged in
 * or not. This will protect the website from users not authorized to
 * see data
 *******************************************************************/
const withAuth = (req, res, next) => {
     if (!req.session.logged_in) {
          res.redirect('/login');
     } else {
          next();
     }
};

module.exports = withAuth;

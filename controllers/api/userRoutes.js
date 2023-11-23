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
const validator = require('validator');
const { Users, Recipe } = require("../../models");

router.post("/register", async (req, res) => {
  
  try {

  const {username, useremail, userpassword} = req.body;

  if (!(validator.isAlpha(username))) {
    return res.status(400).json({ error: "Please enter only alpha characters." });
  }

  if (!(validator.isEmail(useremail))) {
    return res.status(400).json({ error: "Please enter a valid email format." });
  }
  
  if (!(validator.isLength(userpassword, {min: 8}))) {
    return res.status(400).json({ error: "Password must be minimum of 8 characters long." });
  }
  
  
    
    const dsData = await Users.create({
      name: req.body.username,
      email: req.body.useremail,
      password: req.body.userpassword,
    });


    res.status(200).json(dsData);
  } catch (err) {
    res.status(400).json(err);
  }
});






/**
 * User Login POST endpoint - validate user login and create a session at login.
 */
router.post("/login", async (req, res) => {
  
  

  try {

    const {email} = req.body;

    if (!(validator.isEmail(email))) {
      res
        .status(400)
        .json({ message: "Please enter a valid email." });
    }

    // Retrieve user - we use the email address as the login
    const dsData = await Users.findOne({ where: { email: req.body.email } });

    if (!dsData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Compare and validate password against what user has in database
    const validPassword = await dsData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Login successfull create a session and initializer variables based data from table
    req.session.save(() => {
      req.session.user_id = dsData.id;
      req.session.user_name = dsData.name;
      req.session.logged_in = true;
      req.session.origin_call = "/"

      res.json({ user: dsData, message: "You are now logged in!" });
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

/**
 * User POST endpoint logout - destroy session. Returns back to Javscript on main.js to
 * continue with process. It will redirect user to the main portal
 */
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

/**
 * User Registration validation POST endpoint - validate email does not already exists
 * we dont tell the user that information
 */
router.post("/validate", async (req, res) => {
  try {
    // Retrieve user - we use the email address as the login
    const dsData = await Users.findOne({ where: { email: req.body.email } });

    if (dsData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/members", async (req, res) => {
  try {
    const userData = await Users.findAll();
    if (userData) {
      res.status(200).json(userData);
    } else {
      return res.status(404).json(err);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id, {
      include: [{ model: Recipe }],
    });

    if (userData) {
      res.status(200).json(userData);
    } else {
      return res.status(404).json(err);
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

module.exports = router;
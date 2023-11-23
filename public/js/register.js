/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under Apache License
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Date : 11/21/2023 2:46:52 PM
 *******************************************************************/
document.addEventListener("DOMContentLoaded", function () {

     /**
      * Validate email address already exists before process starts
      * @param {*} event 
      * @returns 
      */
     const validateEmailAddress = async (event) => {

          const useremail = document.querySelector('#useremail').value.trim();

          if (useremail === "") {
               alert('You must enter an email address!');
               return false;
          }

          try {
               const response = await fetch('/api/users/validate', {
                    method: 'POST',
                    body: JSON.stringify({ email: useremail }),
                    headers: { 'Content-Type': 'application/json' },
               });

               if (response.ok) {
                    return true;
               } else {
                    alert('Ooops! Email address already registered! try registering a different email address');
                    return false;
               }

          } catch (error) {
               console.error(error);
          }
     }

     /**
      * This function will register a new user into the database
      * @param {*} event 
      * @returns 
      */
     const registerUser = async (event) => {
          event.preventDefault();

          const username = document.getElementById('username').value.trim();
          const useremail = document.getElementById('useremail').value.trim();
          const userpassword = document.getElementById('userpassword').value.trim();
          const passwordvalidate = document.getElementById('passwordvalidate').value.trim();
          
          if (userpassword && (userpassword !== passwordvalidate)) {
               alert('Invalid password! they need to match.');
               return false;
          }

          debugger;

          if (username && useremail) {
               debugger;

               const response = await fetch('/api/users/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, useremail, userpassword }),
                    headers: { 'Content-Type': 'application/json' },
               });

               if (response.ok) {
                    
                    document.location.replace("/list");

               } else {
                    alert('Oh boy! Something went wrong. I am sorry please contact me. Urgh... hate when this happens');
               }
          }
     };

     // Email validation not implemented -we have a different method.
     function validateEmail(email) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
     }

     // Script entry point start process - add here event listeners
     function initialize() {

          document.querySelector('#registration').addEventListener('submit', registerUser);
          document.querySelector('#useremail').addEventListener("blur", validateEmailAddress)
     }

     initialize();

});
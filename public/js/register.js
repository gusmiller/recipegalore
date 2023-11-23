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
     const validateEmailAddress = async () => {

          const useremail = document.querySelector('#useremail').value.trim();

          if (validator.isEmpty(useremail)) {
               alert('You must enter an email address!');
               return false;
          }

          if (!(validator.isEmail(useremail))) {
               alert('Must have a valid email format.')
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

          const useremail = document.querySelector('#useremail').value.trim();
          const userpassword = document.querySelector('#userpassword').value.trim();
          const passwordvalidate = document.querySelector('#passwordvalidate').value.trim();
          const username = document.querySelector('#username').value.trim();


          if (!(validator.isAlpha(username))) {
               alert("Please enter a proper name.")
               return false
          }

          if (validator.isEmpty(userpassword)) {
               alert("Please enter a password.")
               return false;
          }


               if (!(validator.isLength(userpassword, {min: 8}))) {
            alert('Password must be a minimum of 8 characters.')
            return false;
          }

          if (!(validator.equals(userpassword, passwordvalidate))) {               
               alert('Invalid password! they need to match.');
               return false;
          }

          debugger;


          try {
          if (username && useremail && userpassword) {
               const response = await fetch('/api/users/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, useremail, userpassword }),
                    headers: { 'Content-Type': 'application/json' },
               });

               if (response.ok) {
                    
                    document.location.replace("/list");

               } else {
                    throw new Error('Password must be 8 characters or longer.');
               }
          }
     } catch (error) {
         alert("Password must be 8 characters or longer.")
     }

       
};

     // Email validation not implemented -we have a different method.
     // function validateEmail(email) {
     //      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     //      return emailRegex.test(email);
     // }

     // Script entry point start process - add here event listeners
     function initialize() {

          document.querySelector('#registration').addEventListener('submit', registerUser);
          document.querySelector('#useremail').addEventListener("blur", validateEmailAddress)
     }

     initialize();

});
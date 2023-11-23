/*******************************************************************
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under Apache License
 * 
 * Group Project #2 MVC/Express.js
 * Cravings
 * 
 * Date : 11/17/2023 9:30:15 PM
 *******************************************************************/
document.addEventListener("DOMContentLoaded", function () {

     const selectedcat = document.getElementById("categorylist");
     const selectedmem = document.getElementById("memberslist");
     const recipes = document.querySelectorAll('[id^="recipeitem_"]');

     /**
      * This function will iterate through all the post elements and hide
      * the ones which don't match what has been selected by the user. The 
      * process is simple it retrieves the current user and it validate against the 
      * current post to verify user can reply to comment.
      */
     function filterCategory() {
          const selectedValue = selectedcat.value; //Retrieve user selection

          for (var i = 0; i < recipes.length; i++) {

               // For each element we retrieve the category that is loaded in a
               // data-attributes. This allows me to compare with what has been selected
               const value = recipes[i].getAttribute('data-category');

               if (value != selectedValue) {
                    recipes[i].setAttribute('hidden', true)
               } else {
                    if (recipes[i].hasAttribute("hidden")) {
                         recipes[i].removeAttribute("hidden");
                    }
               }
          };
     }

     /**
      * This function will iterate through all the post elements and hide
      * the ones which don't match what has been selected by the user. The 
      * process is simple it retrieves the current user and it validate against the 
      * current post to verify user can reply to comment.
      */
     function filterMembers() {
          const selectedValue = selectedmem.value; //Retrieve user selection

          for (var i = 0; i < recipes.length; i++) {

               // For each element we retrieve the member id which is loaded in a
               // data-attributes. This allows me to compare with what has been selected
               const value = recipes[i].getAttribute('data-memberid');

               if (value != selectedValue) {
                    recipes[i].setAttribute('hidden', true)
               } else {
                    if (recipes[i].hasAttribute("hidden")) {
                         recipes[i].removeAttribute("hidden");
                    }
               }
          };
     }

     /**
      * This will call an APi that will run a sequelize raw SQL to retrieve 
      * only categories that have been used. This way we avoid empty screens.
      */
     const loadCategory = async () => {

          // Jacob is to provide this API/Endpoint. I don't know how he will call it, this will do for now but 
          // it does not work. It is on stand-by
          const response = await fetch('/api/categories', {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
               const data = await response.json();

               // Select the category dropdown control. We are going to insert
               // the options dynamically
               let dropdown = document.getElementById("categorylist");

               for (var i = 0; i < data.length; i++) {
                    let optionitem = document.createElement('option');
                    optionitem.value = data[i].id;
                    optionitem.innerHTML = data[i].name;
                    optionitem.setAttribute('id', 'categoryId' + data[i].id)
                    dropdown.appendChild(optionitem);
               }

          } else {
               alert(response.statusText);
          }
     };

     /**
      * This will call an APi/members endpoint that returns  
      * a list of all members. The code iterates through each table/row and 
      * validates using data attributes whether it matches or not, in case it does 
      * not it hides the row
      */
     const loadMembers = async () => {

          const response = await fetch('/api/users/members', {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
               const data = await response.json();

               // Select the members dropdown control. We are going to insert
               // the options dynamically
               let dropdown = document.getElementById("memberslist");

               // This element may not be present in the DOM - validate before
               if (dropdown !== null) {

                    for (var i = 0; i < data.length; i++) {
                         let optionitem = document.createElement('option');
                         optionitem.value = data[i].id;
                         optionitem.innerHTML = data[i].name;
                         optionitem.setAttribute('id', 'memberId' + data[i].id)
                         dropdown.appendChild(optionitem);
                    }

               }

          } else {
               alert(response.statusText);
          }

     }

     // Script entry point start process - add here event listeners
     function initialize() {

          loadCategory(); //Load the categories from api/categories
          loadMembers() //Load members from api/users/members

          selectedcat.addEventListener("change", filterCategory);

          // This element may not be present in the DOM so do not initialize otherwise 
          // we get an error
          if (selectedmem !== null) {
               selectedmem.addEventListener("change", filterMembers);
          }

     }

     initialize();
});
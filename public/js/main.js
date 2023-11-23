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
$(document).ready(function () {

     function handleRespondLink() {
          const postbuttons = document.querySelectorAll('[id^="commentblock"]');

          postbuttons.forEach(function (element) {
               element.addEventListener('mouseover', async function () {
                    const linkElement = element.children[1]
                    linkElement.removeAttribute('hidden');
               });
               element.addEventListener('mouseout', async function () {
                    const linkElement = element.children[1]
                    linkElement.setAttribute('hidden', true);
               });
          });
     }

     // Add a click event listener to each matching element. User will click on the button when sending 
     // a commment to the post
     function commentEvents() {

          const postbuttons = document.querySelectorAll('[id^="postreply"]');

          postbuttons.forEach(function (element) {
               element.addEventListener('click', async function () {

                    const postbuttons = document.getElementById(element.id);
                    const postid = parseInt(postbuttons.getAttribute("data-postid"), 10)

                    await fetch(`api/posts/create/${postid}`, {
                         method: 'GET',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                    });

               });
          });
     }

     const logUserIn = async () => {
          document.location.replace('/login');
     }

     /**
      * This function will log the user out of the system - it calls the lgout api and 
      * destroy the session cookie. Then it returns to the main page portal.
      */
     const logUserOut = async () => {
          const response = await fetch('/api/users/logout', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
               document.location.replace('/');
          } else {
               alert(response.statusText);
          }
     }

     // Script entry point start process - add here event listeners
     const initApplication = () => {

          const logoutControl = document.querySelector("#logout");
          document.querySelector("#login").addEventListener('click', logUserIn);
          logoutControl.addEventListener('click', logUserOut);

          commentEvents();
          handleRespondLink();
     }


     initApplication();

});
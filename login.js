import { FXMLHttpRequest } from './fajax.js';

/**
 * Handles the login process when the login form is submitted.
 * It prevents the default form submission, sends a POST request to the server with the username and password,
 * and processes the response to either store the session ID and redirect the user or show an error message.
 * 
 * @param {Event} event - The form submit event.
 */
function handleLogin(event) {
    // Prevents the default form submission behavior
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Retrieves the values of the username and password fields
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        // Creates a new XMLHttpRequest object for making HTTP requests
        const xhr = new FXMLHttpRequest();
        xhr.open("POST", "/users/login"); // Sets the request method and URL
        xhr.setRequestHeader("Content-Type", "application/json"); // Sets the content type to JSON
        xhr.onreadystatechange = function () {
            // Checks if the request has completed
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // If login is successful, parse the response and store session data
                    const response = JSON.parse(xhr.responseText);
                    localStorage.setItem("sessionId", response.sessionId); // Save the sessionId to localStorage
                    localStorage.setItem("loggedUser", username); // Save the username to localStorage
                    window.location.hash = "mainPage"; // Redirect to the main page (tasks page)
                } else {
                    // If login fails, display an error message
                    document.getElementById("errorMessageLogin").textContent = "Login failed:( Check your username and password.)";
                }
            }
        };
        // Sends the request with the username and password as a JSON payload
        xhr.send(JSON.stringify({ username, password }));
    });
}

/**
 * Initializes the login form by setting up the event listener for the submit event.
 * This function removes any existing submit event listeners before adding a new one
 * to avoid duplicate event handlers.
 */
function initLogin() {
    const loginForm = document.getElementById("loginForm"); 
    // Removes the previous event listener to prevent duplicates
    loginForm.removeEventListener("submit", handleLogin);
    // Adds the new event listener for the form submission
    loginForm.addEventListener("submit", handleLogin);
}

export { initLogin };

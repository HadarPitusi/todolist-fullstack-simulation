import { FXMLHttpRequest } from './fajax.js';
/**
 * Handles the user registration process when the form is submitted.
 * Validates the password confirmation and sends a registration request.
 * 
 * @param {Event} event - The submit event for the registration form.
 */
function handleRegister(event) {
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Retrieve form values
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate that passwords match
        if (password !== confirmPassword) {
            document.getElementById("errorMessage").textContent = "Passwords do not match!";
            return;
        }

        // Create a new XMLHttpRequest to send registration data
        const xhr = new FXMLHttpRequest();
        xhr.open("POST", "/users/register");
        xhr.setRequestHeader("Content-Type", "application/json");

        // Handle the response from the server
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    // If registration is successful, navigate to the login page
                    window.location.hash = "login";
                } else {
                    // If registration fails, display an error message
                    document.getElementById("errorMessage").textContent = "Registration failed";
                }
            }
        };

        // Send the registration data to the server
        xhr.send(JSON.stringify({ username, password, fullName, email }));
    });
}

/**
 * Initializes the registration form by attaching the submit event listener.
 * Ensures that only one event listener is active to avoid duplicates.
 */
function initRegister() {
    const registerForm = document.getElementById("registerForm");
    // Removes the previous submit event listener and adds it again to prevent duplicates
    registerForm.removeEventListener("submit", handleRegister);
    registerForm.addEventListener("submit", handleRegister);
}

export { initRegister };

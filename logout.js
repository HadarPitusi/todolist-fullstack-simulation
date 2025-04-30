/**
 * Handles the logout process when the user submits a logout request.
 * It removes the logged-in user's data from localStorage and redirects the user to the login page.
 * 
 * @param {Event} event - The event triggered when the user attempts to log out.
 */
function logout(event) {
    // Prevents the default action of the event (e.g., navigating away from the page)
    event.preventDefault();
    
    // Removes the logged-in user's information from localStorage
    localStorage.removeItem("loggedUser");
    
    // Redirects the user to the login page by changing the URL hash
    window.location.hash = "login";
}

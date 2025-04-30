/**
 * Loads the page template and its corresponding script based on the given page name.
 * If the page is "mainPage", it initializes the task manager instead of loading a script.
 * 
 * @param {string} page - The name of the page to be loaded.
 */
function loadPage(page) {
    const template = document.getElementById(`${page}Template`);
    if (!template) {
        console.error(`Template for ${page} does not exist!`);
        return;
    }

    // Clone the template and append it to the "app" container
    const clone = template.content.cloneNode(true);
    document.getElementById("app").innerHTML = "";
    document.getElementById("app").appendChild(clone);

    // If the page is not "mainPage", load its script
    if (page !== "mainPage") {
        loadScript(page);
    } else {
        // For "mainPage", initialize the task manager
        import("./taskManager.js").then(({ initTaskManager }) => {
            initTaskManager();  // Calls the task manager initialization immediately
        });
    }
}

/**
 * Loads the corresponding script for the given page if it hasn't been loaded already.
 * 
 * @param {string} page - The name of the page whose script is to be loaded.
 */
function loadScript(page) {
    const existingScript = document.querySelector(`script[src="${page}.js"]`);
    if (!existingScript) { // If the script doesn't exist, create and add it
        const script = document.createElement("script");
        script.type = "module";
        script.src = `${page}.js`;
        document.body.appendChild(script);
    }
}

/**
 * Handles the navigation by determining the current page based on the URL hash.
 * It loads the appropriate page template and script, and initializes any necessary components.
 */
function handleNavigation() {
    const page = location.hash ? location.hash.replace("#", "") : "login";  // Defaults to "login" if no hash
    loadPage(page);  // Load the page template

    // Initialize the specific page functionality
    if (page === "login") {
        import("./login.js").then(({ initLogin }) => initLogin());  // Initialize login page
    } else if (page === "register") {
        import("./register.js").then(({ initRegister }) => initRegister());  // Initialize register page
    }
}

// Event listeners for navigation changes
window.addEventListener("hashchange", handleNavigation);
window.addEventListener("DOMContentLoaded", handleNavigation);

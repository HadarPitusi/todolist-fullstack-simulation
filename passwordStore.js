// This file defines a separate class to securely store and manage passwords,
// isolated from the main Database for better security.

class PasswordStore {
    // Private static field to store passwords, inaccessible outside this class.
    static #passwords = JSON.parse(localStorage.getItem('passwords')) || {}; 

    // Stores a password for a given user ID.
    static setPassword(userId, password) {
        this.#passwords[userId] = password; // Save the password in the private store.
        // שמירה ל-localStorage
        localStorage.setItem('passwords', JSON.stringify(this.#passwords));
    
    }

    // Verifies if a provided password matches the stored one for a user ID.
    static verifyPassword(userId, password) {
        // Return true if the password matches, false if not (or if no password exists).
        return this.#passwords[userId] === password;
    }

    // Removes a password for a user ID (e.g., if deleting a user in the future).
    static removePassword(userId) {
        delete this.#passwords[userId]; // Delete the password from the store.
        // עדכון ה-localStorage
        localStorage.setItem('passwords', JSON.stringify(this.#passwords));
    }
}

// Export the PasswordStore class for use in Database.
export { PasswordStore };

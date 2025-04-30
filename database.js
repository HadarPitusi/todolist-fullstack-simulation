// This file defines a simple in-memory database to manage users and tasks.
// Passwords are now handled separately in PasswordStore for security.
import { PasswordStore } from './passwordStore.js';

class Database {
    // Static properties act as in-memory storage for users and tasks.

    static usersKey = "usersDB";
    static tasksKey = "tasksDB";
    
    // Load data from localStorage or initialize empty objects.
    static usersDB = JSON.parse(localStorage.getItem(Database.usersKey)) || {};
    static tasksDB = JSON.parse(localStorage.getItem(Database.tasksKey)) || {};

    static saveToLocalStorage() {
        localStorage.setItem(Database.usersKey, JSON.stringify(this.usersDB));
        localStorage.setItem(Database.tasksKey, JSON.stringify(this.tasksDB));
    }

    // Registers a new user with a username and password.
    static registerUser(userName, password, fullName, Email) {
        // Check if the username already exists in usersDB.
        if (Object.values(this.usersDB).some(user => user.username === userName)) {
            return { status: 400, message: "Username already exists" };
        }
        const userId = Date.now(); // Use timestamp as a unique user ID.
        // Store user data without the password.
        this.usersDB[userId] = {
            email:Email,
            fullname: fullName,
             id: userId,
              username: userName
            
            };
        // Store the password separately in PasswordStore.
        PasswordStore.setPassword(userId, password);
        this.tasksDB[userId] = []; // Initialize an empty task list for the user.
        this.saveToLocalStorage(); // Save changes
        return { status: 201, message: "User registered successfully", userId };
    }

    // Logs in a user by verifying their username and password.
    static loginUser(username, password) {
        // Find the user by username in usersDB.
        const user = Object.values(this.usersDB).find(u => u.username === username);
        if (!user) return { status: 404, message: "User not found" };
        // Verify the password using PasswordStore (doesn’t expose the stored password).
        if (!PasswordStore.verifyPassword(user.id, password)) {
            return { status: 401, message: "Incorrect password" };
        }
        return { status: 200, message: "Login successful", user };
    }

    // Retrieves all tasks for a given user ID.
    static getUserTasks(userId) {
        return { status: 200, tasks: this.tasksDB[userId] || [] }; // Return empty array if no tasks.
    }

    // Adds a new task for a user.
    static addTask(userId, title) {
        if (!title.trim()) return { status: 400, message: "Task title cannot be empty" };
        const taskId = Date.now(); // Use timestamp as a unique task ID.
        const newTask = { id: taskId, title, completed: false }; // Create a new task object.
        this.tasksDB[userId].push(newTask); // Add it to the user’s task list.
        this.saveToLocalStorage(); // Save changes
        return { status: 201, task: newTask };
    }

    // Deletes a task by ID for a user.
    static deleteTask(userId, taskId) {
        // Filter out the task with the matching ID from the user’s task list.
        this.tasksDB[userId] = this.tasksDB[userId].filter(t => t.id !== taskId);
        this.saveToLocalStorage(); // Save changes
        return { status: 200, message: "Task deleted successfully" };
    }

    // Toggles the completed status of a task.
    static toggleTask(userId, taskId) {
        const task = this.tasksDB[userId].find(t => t.id === taskId);
        if (!task) return { status: 404, message: "Task not found" };
        task.completed = !task.completed; // Flip the completed flag.
        this.saveToLocalStorage(); // Save changes
        return { status: 200, task };
    }

    // Updates the title of an existing task.
    static updateTaskTitle(userId, taskId, newTitle) {
        const task = this.tasksDB[userId].find(t => t.id === taskId);
        if (!task) return { status: 404, message: "Task not found" };
        if (!newTitle.trim()) return { status: 400, message: "Task title cannot be empty" };
        task.title = newTitle; // Update the task’s title.
        this.saveToLocalStorage(); // Save changes
        return { status: 200, task };
    }
}
// Export the Database class for use in the Server.
export { Database };

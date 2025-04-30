// This file defines a Server class that processes requests from the Network,
// handling user and task operations with session management.
import { Database } from './database.js';

class Server {
    // Static property to store active sessions (sessionId -> userId mapping).
    static sessions = {};

    // Main method to handle incoming requests based on URL and method.
    static handleRequest(request) {
        const { method, url, data, sessionId } = request; // Destructure the request object.

        if (url.startsWith("/users")) { // Handle user-related requests.
            return this.userServer(method, url, data, sessionId);
        } else if (url.startsWith("/tasks")) { // Handle task-related requests.
            return this.taskServer(method, url, data, sessionId);
        }
        return { status: 404, message: "Not Found" }; // Default response for unknown URLs.
    }

    // Handles user-specific requests like registration and login.
    static userServer(method, url, data, sessionId) {
        if (method === "POST" && url === "/users/register") {
            // Register a new user using the Database.
            return Database.registerUser(data.username, data.password, data.fullName, data.email);
        }
        if (method === "POST" && url === "/users/login") {
            // Attempt to log in a user.
            let response = Database.loginUser(data.username, data.password);
            if (response.status === 200) { // If login succeeds, create a session.
                const newSessionId = Date.now() + "-" + Math.random(); // Unique session ID.
                this.sessions[newSessionId] = response.user.id; // Map session to user ID.
                response.sessionId = newSessionId; // Include session ID in the response.
            }
            return response;
        }
        return { status: 400, message: "Invalid request" }; // Default for invalid user requests.
    }

    // Handles task-specific requests, requiring a valid session.
    static taskServer(method, url, data, sessionId) {
        const userId = this.sessions[sessionId]; // Look up user ID from session ID.
        if (!userId) return { status: 401, message: "Unauthorized" }; // No valid session.

        if (method === "GET" && url === "/tasks") {
            // Get all tasks for the user.
            return Database.getUserTasks(userId);
        }
        if (method === "POST" && url === "/tasks") {
            // Add a new task for the user.
            return Database.addTask(userId, data.title);
        }
        if (method === "DELETE" && url.startsWith("/tasks/")) {
            const taskId = parseInt(url.split("/")[2]); // Extract task ID from URL.
            // Delete the specified task.
            return Database.deleteTask(userId, taskId);
        }
        if (method === "PUT" && url.startsWith("/tasks/")) {
            const taskId = parseInt(url.split("/")[2]); // Extract task ID from URL.
            // If data includes a title, update the task title; otherwise, toggle completion.
            if (data && data.title !== undefined) {
                return Database.updateTaskTitle(userId, taskId, data.title);
            }
            return Database.toggleTask(userId, taskId);
        }
        return { status: 400, message: "Invalid request" }; // Default for invalid task requests.
    }
}
// Export the Server class for use in Network.
export { Server };
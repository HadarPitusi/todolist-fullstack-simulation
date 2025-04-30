import { FXMLHttpRequest } from './fajax.js';
import * as taskRenderer from './taskRenderer.js';

/**
 * Fetches the list of tasks from the server and updates the task lists on the page.
 * It sends a GET request with the session ID to the server and updates the task list on success.
 */
function getTasks() {
    const xhr = new FXMLHttpRequest();
    const sessionId = localStorage.getItem('sessionId');  // Retrieves the sessionId from localStorage
    xhr.open("GET", "/tasks");
    xhr.setRequestHeader("sessionId", sessionId);  // Sends the sessionId in the request header
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            taskRenderer.updateTaskLists(response.tasks);  // Updates the task list on the page
        }
    }
    xhr.send();
}

/**
 * Adds a new task to the server.
 * It takes the task input from the user, sends it as a POST request, and reloads the tasks.
 */
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText) {
        const task = { title: taskText };

        const xhr = new FXMLHttpRequest();
        const sessionId = localStorage.getItem('sessionId');  // Retrieves the sessionId from localStorage
        xhr.open("POST", "/tasks");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    getTasks();  // Reload tasks after adding a new task
                    taskRenderer.clearTaskInput();  // Clears the task input field
                }
            }
        };
        xhr.send(JSON.stringify(task));  // Sends the new task to the server
    }
}

/**
 * Updates the task with the given ID on the server.
 * It sends a PUT request with the updated task data and reloads the tasks on success.
 * 
 * @param {number} taskId - The ID of the task to update.
 * @param {string} newTaskText - The new text for the task.
 */
function updateTask(taskId, newTaskText) {
    const data = { id: taskId, title: newTaskText };
    const xhr = new FXMLHttpRequest();
    const sessionId = localStorage.getItem('sessionId');  // Retrieves the sessionId from localStorage
    xhr.open("PUT", `/tasks/${taskId}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("sessionId", sessionId);  // Sends the sessionId in the request header
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200)
            getTasks();  // Reload tasks after updating the task
    }
    xhr.send(JSON.stringify(data));  // Sends the updated task data to the server
}

/**
 * Deletes the task with the given ID from the server.
 * It sends a DELETE request and reloads the tasks on success.
 * 
 * @param {number} taskId - The ID of the task to delete.
 */
function deleteTask(taskId) {
    const xhr = new FXMLHttpRequest();
    const sessionId = localStorage.getItem('sessionId');  // Retrieves the sessionId from localStorage
    xhr.open("DELETE", `/tasks/${taskId}`);
    xhr.setRequestHeader("sessionId", sessionId);  // Sends the sessionId in the request header
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            getTasks();  // Reload tasks after deleting a task
        }
    };
    xhr.send();  // Sends the delete request to the server
}

/**
 * Marks the task as completed or uncompleted on the server.
 * It sends a PUT request to update the completion status of the task.
 * 
 * @param {number} taskId - The ID of the task to mark as completed or uncompleted.
 * @param {boolean} completed - The new completion status of the task.
 */
function missionCompleted(taskId, completed) {
    const xhr = new FXMLHttpRequest();
    const sessionId = localStorage.getItem('sessionId');  // Retrieves the sessionId from localStorage
    xhr.open("PUT", `/tasks/${taskId}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("sessionId", sessionId);  // Sends the sessionId in the request header
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            getTasks();  // Reload tasks after updating the completion status
        }
    };
    xhr.send(JSON.stringify({ id: taskId, completed }));  // Sends the updated completion status to the server
}

/**
 * Initializes the task manager by setting up the "Add Task" button's event listener.
 * It also loads the tasks when the page is first loaded.
 */
function initTaskManager() {
    const addButton = document.getElementById("addTaskButton");
    if (addButton) {
        addButton.addEventListener("click", addTask);  // Sets up the event listener for adding a new task
        getTasks();  // Loads the tasks when the page is initialized
    }
    return;
}

// Initializes the task manager functionality
export { initTaskManager, updateTask, deleteTask, missionCompleted };

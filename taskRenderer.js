import { deleteTask, updateTask, missionCompleted } from './taskManager.js';

/**
 * Updates the task lists by populating the task and completed lists with task items.
 * It iterates over the given tasks, creating corresponding elements for each task, including:
 * - Task title input field
 * - Delete button
 * - Complete button
 * 
 * If a task is completed, it will be moved to the completed list and will be marked as read-only.
 * 
 * @param {Array} tasks - The array of tasks to be displayed. Each task is expected to have the properties:
 *    - id: Unique identifier for the task.
 *    - title: The title or name of the task.
 *    - completed: A boolean indicating whether the task is completed.
 */
function updateTaskLists(tasks) {
    const taskList = document.getElementById("taskList");
    const completedList = document.getElementById("completedList");

    const taskFragment = document.createDocumentFragment();
    const completedFragment = document.createDocumentFragment();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.id = `task-${task.id}`;
        li.classList.add("task-item"); // General class for uniform styling

        const input = document.createElement("input");
        input.type = "text";
        input.value = task.title;

        if (task.completed) {
            input.readOnly = true; // Prevent editing completed tasks
            li.classList.add("task-done"); // Adds a strikethrough style for completed tasks
        }

        // Event handler when the task title input loses focus
        input.onblur = function() {
            if (!task.completed && input.value.trim() === "") {
                deleteTask(task.id); // Deletes task if title is empty
            } else if (!task.completed) {
                updateTask(task.id, input.value); // Updates task title if not completed
            }
        };

        // Delete button functionality
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = function() {
            deleteTask(task.id); // Deletes the task when clicked
        };

        // Complete button functionality
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "↩️" : "✔️";
        completeButton.classList.add("complete-btn");
        completeButton.onclick = function() {
            missionCompleted(task.id, !task.completed); // Toggles the task completion status
        };

        // Append input, delete button, and complete button to the task list item
        li.appendChild(input);
        li.appendChild(deleteButton);
        li.appendChild(completeButton);

        // Assign task to either active or completed list based on the completion status
        if (task.completed) {
            completedFragment.appendChild(li);
        } else {
            taskFragment.appendChild(li);
        }
    });

    // Clear existing lists and append the updated task fragments
    taskList.innerHTML = "";
    completedList.innerHTML = "";
    taskList.appendChild(taskFragment);
    completedList.appendChild(completedFragment);
}

/**
 * Clears the task input field.
 */
function clearTaskInput() {
    document.getElementById("taskInput").value = "";
}

export { updateTaskLists, clearTaskInput };

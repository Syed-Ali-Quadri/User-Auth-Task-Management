// Import necessary modules and models
import { User } from "../models/user.model.js"; // Import the User model to interact with the MongoDB 'users' collection
import { Task } from "../models/task.model.js"; // Import the Task model to interact with the MongoDB 'tasks' collection
import { ApiError } from "../utilities/ApiError.js"; // Import a custom API error handler
import { AsyncHandler } from "../utilities/AsyncHandler.js"; // Utility to handle asynchronous route handlers and catch errors
import { ApiResponse } from "../utilities/ApiResponse.js"; // Utility for structuring API responses

// Controller to create a new task
const createTask = AsyncHandler(async (req, res) => {
    // Destructure title and description from the request body
	const { title, description } = req.body;

    // Check if title and description are provided, if not throw an error
	if (!title || !description)
		throw new ApiError(401, "Fill the required fields");

    // Fetch the user from the database based on the user id in the request (req.user is set from the auth middleware)
	const user = await User.findById(req.user.id);
	console.log("User data", user); // Log the user data for debugging purposes

    // If the user is not found, throw an error
	if (!user) throw new ApiError(401, "Invalid user");

    // Create a new task in the 'tasks' collection
	const createTask = await Task.create({
		title,
		description
	});

    // If task creation fails, throw an error
	if (!createTask)
		throw new ApiError(401, "something went wrong creating task");

    // Push the created task's ID to the user's 'tasks' array and update the user in the database
	const updateUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			$push: { tasks: createTask._id } // Push task ID to the tasks array
		},
		{ new: true, useFindAndUpdate: false } // Ensure the updated user document is returned
	);

	await updateUser.save(); // Save the updated user document

	console.log("updateUser", updateUser); // Log the updated user for debugging

    // Return a successful response with the created task
	return res
		.status(200)
		.json(new ApiResponse(201, createTask, "Successfully created task"));
});

// Controller to update a specific task
const updateTask = AsyncHandler(async (req, res) => {
    // Destructure updated description and title from the request body
	const { updatedDescription, updatedTitle } = req.body;
    // Get the task ID from the request parameters
	const { taskId } = req.params;

    // Check if either updated description or title is provided, if not throw an error
	if (!updatedDescription && !updatedTitle)
		throw new ApiError(401, "Please provide at least one field");

    // Find the task by its ID
	const task = await Task.findById(taskId);

	let isModified = false; // Flag to check if any modifications are made

    // If the updated title is provided and it's different from the current title, update it
	if (updatedTitle && updatedTitle !== task.title) {
		task.title = updatedTitle;
		isModified = true; // Mark task as modified
	}
    // If the updated description is provided and it's different, update it
	if (updatedDescription && updatedDescription !== task.description) {
		task.description = updatedDescription;
		isModified = true; // Mark task as modified
	}

    // If any changes were made, save the updated task
	if (isModified) await task.save();

    // If the task was not found, throw an error
	if (!task) throw new ApiError(401, "Task not found");

    // Return a successful response with the updated task
	return res
		.status(200)
		.json(new ApiResponse(200, task, "Task updated successfully."));
});

// Controller to delete a specific task
const deleteTask = AsyncHandler(async (req, res) => {
    // Get the task ID from the request parameters
	const { taskId } = req.params;

    // If no task ID is provided, throw an error
	if (!taskId) this.error(404, "Task not found");

    // Find and delete the task by its ID
	const task = await Task.findByIdAndDelete(taskId);

    // If the task is not found, throw an error
	if (!task) throw new ApiError(401, "Task not found");

    // Return a successful response indicating the task was deleted
	return res
		.status(200)
		.json(new ApiResponse(201, task, "Task successfully deleted"));
});

// Controller to get a specific task by its ID
const specificTask = AsyncHandler(async (req, res) => {
    // Get the task ID from the request parameters
	const { taskId } = req.params;

    // If no task ID is provided, throw an error
	if (!taskId) throw new ApiError(401, "Invalid task ID");

    // Find the task by its ID
	const task = await Task.findById(taskId);

    // If the task is not found, throw an error
	if (!task) throw new ApiError(401, "Task not found");

    // Return a successful response with the task details
	return res
		.status(200)
		.json(new ApiResponse(200, task, "Task details fetched successfully."));
});

// Controller to fetch all tasks of the authenticated user
const userTasks = AsyncHandler(async (req, res) => {
    // Get the user ID from the authenticated user's request object
	const userId = req.user.id;

    // Find the user by ID and populate their tasks array with task details
	const userTask = await User.findById(userId).populate("tasks");

    // Return a successful response with the user's tasks
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				userTask.tasks, // Return the tasks array
				"User's tasks fetched successfully."
			)
		);
});

// Controller to update the status of a specific task
const statusInTask = AsyncHandler(async (req, res) => {
    // Destructure the new status from the request body
	const { statusTask } = req.body;
    // Get the task ID from the request parameters
	const { taskId } = req.params;

    // If no status is provided, throw an error
	if (!statusTask) {
		throw new ApiError(401, "Please provide status");
	}

    // Find the task by its ID
	const task = await Task.findById(taskId);

    // If the task is not found, throw an error
	if (!task) throw new ApiError(401, "Task not found");

    // Update the task's status with the new status
	task.status = statusTask;

    // Save the updated task
	await task.save();

    // Return a successful response with the updated task
	return res
		.status(200)
		.json(new ApiResponse(200, task, "Task status updated successfully."));
});

// Export all task-related controller functions for use in other modules
export { createTask, updateTask, deleteTask, specificTask, userTasks, statusInTask };

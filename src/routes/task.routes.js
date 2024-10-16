// Import the Router class from the Express framework to define routes
import { Router } from "express";

// Import task-related controller functions to handle task operations
import { 
  createTask,     // Function to create a new task
  deleteTask,     // Function to delete an existing task
  specificTask,   // Function to get a specific task by ID
  updateTask,     // Function to update an existing task
  userTasks       // Function to get all tasks related to a specific user
} from "../controllers/task.controller.js";

// Import the authentication middleware to protect routes
import { verifyAuth } from "../middlewares/auth.middleware.js";

// Create an instance of the Express Router
const router = Router();

// Route to create a new task
// POST request to /create-task is handled by the createTask controller
// This route is protected by verifyAuth middleware, so only authenticated users can create tasks
router.route("/create-task").post(verifyAuth, createTask);

// Route to update an existing task
// PUT request to /update-task/:taskId is handled by the updateTask controller
// The route is protected, and the task ID is passed as a route parameter
router.route("/update-task/:taskId").put(verifyAuth, updateTask);

// Route to delete an existing task
// DELETE request to /delete-task/:taskId is handled by the deleteTask controller
// Protected route with task ID passed as a parameter to identify the task to be deleted
router.route("/delete-task/:taskId").delete(verifyAuth, deleteTask);

// Route to fetch a specific task by its ID
// GET request to /task/:taskId is handled by the specificTask controller
// The task ID is passed as a route parameter, and authentication is required
router.route("/task/:taskId").get(verifyAuth, specificTask);

// Route to fetch all tasks related to the authenticated user
// GET request to /user-tasks is handled by the userTasks controller
// Protected route where the logged-in user's tasks are retrieved
router.route("/user-tasks").get(verifyAuth, userTasks);

// Export the router for use in other parts of the application
export default router;

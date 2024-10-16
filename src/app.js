// Import necessary modules
import express from "express"; // Import the Express framework for building web applications
import cookieParser from "cookie-parser"; // Import the cookie-parser middleware for handling cookies
import { CONFIG_EXPRESS_LIMIT } from "./constants.js"; // Import configuration constants, such as request size limits

// Create an instance of the Express application
const app = express();

// Middleware to parse incoming JSON request bodies
// It sets a size limit for the incoming request bodies as defined in CONFIG_EXPRESS_LIMIT
app.use(express.json({ limit: CONFIG_EXPRESS_LIMIT }));

// Middleware to parse URL-encoded request bodies
// It also sets a size limit and allows for nested objects in the URL-encoded data
app.use(express.urlencoded({ extended: true, limit: CONFIG_EXPRESS_LIMIT }));

// Serve static files from the "public" directory
// This allows the app to serve static resources such as images, CSS, and JavaScript files located in the "public" folder
app.use(express.static("public"));

// Middleware to parse cookies attached to incoming requests
// This allows access to cookies via req.cookies in route handlers, useful for session management or authentication tokens
app.use(cookieParser());

// Import route definitions for user-related and task-related API endpoints
import userRoute from "./routes/user.routes.js"; // Routes for user registration, login, etc.
import taskRoute from "./routes/task.routes.js"; // Routes for managing tasks

// Register user routes with a base path of "/api/v1/users/"
// All user-related API requests will be handled under this path
app.use("/api/v1/users/", userRoute);

// Register task routes with a base path of "/api/v1/user/tasks"
// This handles all task-related operations, such as creating, updating, or deleting tasks
app.use("/api/v1/user/tasks", taskRoute);

// Export the Express application instance for use in other modules (e.g., to start the server in index.js)
export { app };

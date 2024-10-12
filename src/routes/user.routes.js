// Import the Router class from the Express framework for creating routes
import { Router } from "express";
// Import the changePassword, loginUser, and registerUser controller functions
import { changeDetail, changePassword, currentUser, loginUser, registerUser } from "../controllers/user.controller.js";
// Import the verifyAuth middleware to protect certain routes
import { verifyAuth } from "../middlewares/auth.middleware.js";

// Create an instance of Router to define routes
const router = Router();

// Define the /register route for user registration
// When a POST request is made to /register, the registerUser controller is invoked
router.route("/register").post(registerUser);

// Define the /login route for user login
// When a GET request is made to /login, the loginUser controller is invoked
router.route("/login").get(loginUser);

// Protected routes: Only authenticated users can access this route (verifyAuth middleware)

// Define the /change-password route for changing the user's password
// When a PUT request is made to /change-password, the changePassword controller is invoked
router.route("/change-password").put(verifyAuth, changePassword);

router.route("/change-details").put(verifyAuth, changeDetail);
router.route("/current-user").get(verifyAuth, currentUser);

// Export the router for use in other modules (like the main app) to handle the routes
export default router;

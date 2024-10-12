// Import the Router class from the Express framework for creating routes
import { Router } from "express";
// Import the loginUser and registerUser controller functions
import { loginUser, registerUser } from "../controllers/user.controller.js";

// Create an instance of Router
const router = Router();

// Define the /register route for user registration
// When a POST request is made to /register, the registerUser controller is invoked
router.route("/register").post(registerUser);

// Define the /login route for user login
// When a GET request is made to /login, the loginUser controller is invoked
router.route("/login").get(loginUser);

// Export the router for use in other modules
export default router;

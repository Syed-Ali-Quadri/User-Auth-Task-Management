// Import the Router class from the Express framework to create routes
import { Router } from "express";

// Import the controller functions responsible for handling various user-related requests
import { 
  changeDetail,        // Function to handle updating user's details
  changePassword,      // Function to handle password change
  currentUser,         // Function to get the current user's details
  getRefreshToken,     // Function to handle refresh token requests
  loginUser,           // Function to handle user login
  registerUser         // Function to handle user registration
} from "../controllers/user.controller.js";

// Import the verifyAuth middleware to protect certain routes by ensuring that the user is authenticated
import { verifyAuth } from "../middlewares/auth.middleware.js";

// Create an instance of Router to define various API routes for user operations
const router = Router();

// Define the /register route for user registration
// When a POST request is made to /register, the registerUser controller is called to handle user signup
router.route("/register").post(registerUser);

// Define the /login route for user login
// When a GET request is made to /login, the loginUser controller is called to handle user authentication
router.route("/login").get(loginUser);

// Protected routes: These routes require the user to be authenticated using the verifyAuth middleware

// Define the /change-password route for users to change their password
// When a PUT request is made to /change-password, the changePassword controller is called to handle the request
router.route("/change-password").put(verifyAuth, changePassword);

// Define the /change-details route for users to update their account details (e.g., email, username)
// This route is protected by verifyAuth middleware, ensuring only authenticated users can update their details
router.route("/change-details").put(verifyAuth, changeDetail);

// Define the /current-user route to get information about the currently logged-in user
// The currentUser controller will retrieve and return the user's details after successful authentication
router.route("/current-user").get(verifyAuth, currentUser);

// Define the /refresh-token route to get a new access token using a refresh token
// This route helps users stay logged in by requesting a new access token after the previous one expires
router.route("/refresh-token").put(verifyAuth, getRefreshToken);

// Export the router so it can be used in the main application to handle the defined routes
export default router;

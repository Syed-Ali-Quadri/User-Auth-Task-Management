// Import necessary modules
import { User } from "../models/user.model.js"; // Importing the User model to interact with MongoDB users collection.
import { ApiError } from "../utilities/ApiError.js"; // Custom error class to handle API errors.
import { AsyncHandler } from "../utilities/AsyncHandler.js"; // Utility to handle asynchronous functions and catch errors.
import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library to handle JWT verification.

// Middleware to verify user authentication
const verifyAuth = AsyncHandler(async (req, res, next) => {
    // Try to extract token from cookies or from the Authorization header (if present)
    const token = req.cookies?.accessToken;

    // If no token is found, throw an error indicating unauthorized access
    if (!token) throw new ApiError(401, "Unauthorized access.");

    // Verify the token using the secret stored in the environment variables (process.env.ACCESS_TOKEN)
    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    // If the token is invalid, throw an error indicating an invalid access token
    if (!verifyToken) throw new ApiError(401, "Invalid access token.");

    // console.log("verifyToken : ", verifyToken); // Log the user details for debugging purposes

    // Find the user associated with the token's payload (_id)
    const user = await User.findById(verifyToken.id).select("-password -refreshToken");

    // If no user is found, throw an error indicating the user was not found
    if (!user) throw new ApiError(401, "User not found.");

    // Attach the user object to the request (req) so that the next middleware or route handler can access the authenticated user's data
    req.user = user;

    // Call the next middleware function or route handler
    next();
});

// Export the verifyAuth middleware so it can be used in other parts of the application
export { verifyAuth };

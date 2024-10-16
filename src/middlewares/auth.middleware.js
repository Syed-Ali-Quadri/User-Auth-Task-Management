// Import necessary modules
import { User } from "../models/user.model.js"; // User model to interact with MongoDB's users collection.
import { ApiError } from "../utilities/ApiError.js"; // Custom error class to handle API-related errors.
import { AsyncHandler } from "../utilities/AsyncHandler.js"; // Utility to handle asynchronous functions and catch errors.
import jwt from "jsonwebtoken"; // JWT library for verifying JSON Web Tokens (JWT).

// Middleware to verify user authentication
const verifyAuth = AsyncHandler(async (req, res, next) => {
    try {
        // Step 1: Extract the token
        // Check if the token is available in cookies or in the "Authorization" header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer: ", "");

        // Step 2: Handle missing token
        // If the token is missing, throw an error indicating that the user is not authorized
        if (!token) throw new ApiError(401, "Unauthorized access.");

        // Step 3: Verify the token
        // Validate the token using the secret (ACCESS_TOKEN) stored in environment variables
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);

        // Step 4: Handle invalid token
        // If token verification fails, throw an error indicating invalid access
        if (!verifyToken) throw new ApiError(401, "Invalid access token.");

        // Step 5: Find the user associated with the token
        // Retrieve the user from the database using the verified token's payload (`_id`)
        const user = await User.findById(verifyToken.id).select("-password -refreshToken"); // Exclude password and refreshToken from the result

        // Step 6: Handle user not found
        // If the user does not exist, throw an error
        if (!user) throw new ApiError(401, "User not found.");

        // Step 7: Attach user data to the request object
        // Attach the user to the `req` object, making it accessible to the next middleware/route handler
        req.user = user;

        // Step 8: Call next middleware or route handler
        next();
    } catch (error) {
        // Catch any errors and throw an ApiError
        throw new ApiError(401, error.message || "Invalid authentication access");
    }
});

// Export the verifyAuth middleware so it can be used in other routes to protect them
export { verifyAuth };

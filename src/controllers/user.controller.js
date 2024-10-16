// Import required utility and model modules
import { AsyncHandler } from "../utilities/AsyncHandler.js"; // Handles asynchronous code and catches errors automatically
import { ApiError } from "../utilities/ApiError.js"; // Custom error handler for managing API errors
import { ApiResponse } from "../utilities/ApiResponse.js"; // Custom response handler for consistent API responses
import { User } from "../models/user.model.js"; // Importing the User model for database operations

// Register User function using AsyncHandler to manage asynchronous operations
const registerUser = AsyncHandler(async (req, res) => {
	// Destructure necessary fields from the request body
	const { username, fullName, email, password } = req.body;

	// Step 1: Validate input fields. Check if any of the fields are missing.
	if (!username || !fullName || !email || !password) {
		throw new ApiError(400, "All fields are required"); // Throw an error if any field is missing
	}

	// Step 2: Check if the username or email already exists in the database.
	const existedUsername = await User.findOne({
		$or: [{ username }, { email }] // Search for an existing user with either the same username or email
	});

	// If the username or email exists, throw an error.
	if (existedUsername) {
		throw new ApiError(400, "Username or email already exists");
	}

	// Step 3: Create a new user in the database with the provided details.
	const user = await User.create({
		username,
		fullName,
		email: email.toLowerCase(), // Ensure the email is saved in lowercase
		password
	});

	// Step 4: Retrieve the created user without sensitive information (password, refreshToken)
	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	// If something went wrong and the user was not created, throw an error.
	if (!createdUser) throw new ApiError(401, "Something went wrong");

	// Step 5: Send a success response back to the client with the created user details.
	return res
		.status(200) // Status code 200 indicates a successful operation
		.json(new ApiResponse(200, createdUser, "Successfully created user.")); // Custom API response with the created user
});

// Function to generate access and refresh tokens for a given user ID
const generateAccessTokenAndRefreshToken = async userId => {
	// Step 1: Find the user by their ID
	const user = await User.findById(userId);

	console.log("Upper User: ", user); // Log the user details for debugging purposes

	// Step 2: Generate an access token and refresh token using user methods.
	const AccessToken = await user.generateAccessToken();
	const RefreshToken = await user.generateRefreshToken();

	// Step 3: Return both the access and refresh tokens.
	return { AccessToken, RefreshToken };
};

// Login User function using AsyncHandler to manage asynchronous operations
const loginUser = AsyncHandler(async (req, res) => {
	// Step 1: Destructure required fields (email, username, and password) from the request body
	const { email, username, password } = req.body;

	// Step 2: Validate if email/username and password are provided
	if ((!email && !username) || !password)
		throw new ApiError(401, "Provide the details in the field");

	// Step 3: Find the user in the database by username or email
	const checkUser = await User.findOne({
		$or: [{ username }, { email }] // Search by either username or email
	});

	console.log("CheckUser: ", checkUser); // Log the found user details for debugging purposes

	// Step 4: If the user does not exist, throw an error
	if (!checkUser)
		throw new ApiError(401, "This user is not exist in the database.");

	// Step 5: Verify if the password matches the one stored in the database
	const isPasswordMatch = await checkUser.isPasswordCorrect(password);

	// Step 6: If the password does not match, throw an error
	if (!isPasswordMatch) throw new ApiError(401, "Password does not match.");

	console.log("Is password correct: ", isPasswordMatch); // Log the result of password match

	// Step 7: Generate access and refresh tokens for the authenticated user
	const {
		AccessToken,
		RefreshToken
	} = await generateAccessTokenAndRefreshToken(checkUser._id);

	checkUser.refreshToken = RefreshToken;

	await checkUser.save({ validateBeforeSave: true });

	// Step 8: Retrieve user details without sensitive information (password, refreshToken)
	const logginUser = await User.findById(checkUser._id).select(
		"-password -refreshToken"
	);

	// Step 9: Set options for cookies (httpOnly, secure, sameSite) for better security
	const options = {
		httpOnly: true, // Ensures cookies cannot be accessed via JavaScript
		secure: true, // Ensures cookies are sent only over HTTPS
		sameSite: "Strict" // Ensures cookies are sent only with requests initiated by the same site
	};

	// Step 10: Send a success response back to the client with cookies and user details.
	return res
		.status(200) // Status code 200 indicates a successful operation
		.cookie("refreshToken", RefreshToken, options) // Set the refresh token in the cookie
		.cookie("accessToken", AccessToken, options) // Set the access token in the cookie
		.json(
			new ApiResponse(
				200,
				{ user: logginUser, AccessToken, RefreshToken },
				"User successfully logged in."
			)
		); // Custom API response with tokens and user details
});

// Define the changePassword function using an AsyncHandler to handle the asynchronous request.
const changePassword = AsyncHandler(async (req, res) => {
	// Destructure oldPassword and newPassword from the request body
	const { oldPassword, newPassword } = req.body;

	// Step 1: Find the user based on the ID stored in the authenticated request (req.user)
	const user = await User.findById(req.user?.id);
	console.log("request User : ", user); // Log the user details for debugging purposes

	// Step 2: Check if oldPassword and newPassword are provided, if not, throw an error
	if (!oldPassword || !newPassword) throw new ApiError(401, "Provide the details in the field");

	// Step 3: Validate if the oldPassword and newPassword are different
	if (oldPassword === newPassword) throw new ApiError(401, "New password should be different.");

	// Step 4: Check if the provided old password matches the user's current password
	const checkPass = await user.isPasswordCorrect(oldPassword);

	// Step 5: If old password doesn't match, throw an error
	if (!checkPass) throw new ApiError(401, "Old password does not match.");

	// Step 6: If the old password is correct, update the user's password with the new password
	user.password = newPassword;

	// Step 7: Save the updated user details to the database
	await user.save();

	// Step 8: Send a success response once the password is changed
	return res
		.status(200)
		.json(new ApiResponse(200, "Password changed successfully."));
});

const changeDetail = AsyncHandler(async (req, res) => {
	const { newFullName, newUsername, newEmail } = req.body;
	
	const user = await User.findById(req.user.id)
	console.log("Request user: ", user)

	if(!newFullName && !newUsername && !newEmail) throw new ApiError(401, "Please fill any of the fields.")

    let isUpdated = false;

    if (newFullName && newFullName !== user.fullName) {
        user.fullName = newFullName;
        isUpdated = true;
    }

    if (newEmail && newEmail !== user.email) {
        user.email = newEmail;
        isUpdated = true;
    }
    if (newUsername && newUsername !== user.username) {
        user.username = newUsername;
        isUpdated = true;
    }

    if (isUpdated) {
        await user.save(); // Saving updated user data.
    } else {
        throw new ApiError(400, "No changes to update.");
    }

	const updatedUser = await User.findById(user._id).select("-password -refreshToken")

	return res
	.status(200)
	.json(new ApiResponse(200,updatedUser, "Details changed successfully."))
})

const currentUser = AsyncHandler(async (req, res) => {

	const user = await User.findById(req.user?.id).select("-password -refreshToken")

	return res.status(200).json(new ApiResponse(200, user, "User details fetch successfully"))
})

const getRefreshToken = AsyncHandler(async (req, res) => {
	
})

// Export user functions for use in routes
export { registerUser, loginUser, changePassword, changeDetail, currentUser, getRefreshToken };

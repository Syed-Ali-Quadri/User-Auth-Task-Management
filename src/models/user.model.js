// Import mongoose and the Schema class for MongoDB object modeling
import mongoose, { Schema } from "mongoose";
// Import bcrypt for password hashing
import bcrypt from "bcrypt";
// Import jsonwebtoken for generating tokens
import jwt from "jsonwebtoken";

// Define the user schema with required fields and validation rules
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true, // Username is required
			unique: true, // Username must be unique
			lowercase: [true, "Username must be lowercase"], // Username must be in lowercase
			trim: true, // Trim whitespace from username
			minlength: [5, "Username must be at least 5 characters long"], // Minimum length of 5 characters
			maxlength: [20, "Username must be at most 20 characters long"], // Maximum length of 20 characters
			index: true // Create an index for username for faster search
		},
		fullName: {
			type: String,
			required: true, // Full name is required
			maxLength: 30 // Maximum length of full name is 30 characters
		},
		email: {
			type: String,
			required: true, // Email is required
			unique: true, // Email must be unique
			lowercase: [true, "Email must be lowercase"] // Email must be in lowercase
		},
		password: {
			type: String,
			required: true, // Password is required
			minlength: [8, "Password must be at least 8 characters long"] // Minimum length of password is 8 characters
		},
		tasks: {
			type: [Schema.Types.ObjectId], // Array of ObjectIds referencing Task model
			ref: "Task" // Reference to Task model for population
		},
		refreshToken: {
			type: String // Refresh token for user session management
		}
	},
	{ timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

// Pre-save middleware to hash the password before saving to the database
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // Proceed if password is not modified
	this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10
	next(); // Proceed to the next middleware
});

// Method to compare provided password with stored hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) // Compare and return true if matches
}

// Method to generate an access token for the user
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        id: this._id, // User ID
        username: this.username, // Username
        email: this.email, // Email
        fullName: this.fullName // Full name
    }, process.env.ACCESS_TOKEN, { // Secret key from environment variables
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Token expiry from environment variables
    })
}

// Method to generate a refresh token for the user
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        id: this._id // User ID
    }, process.env.REFRESH_TOKEN, { // Secret key from environment variables
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Token expiry from environment variables
    })
}

// Export the User model based on the user schema
export const User = mongoose.model("User", userSchema);

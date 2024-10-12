// Import the connectDB function for connecting to the MongoDB database
import { connectDB } from "./db/index.js";
// Import the Express application instance
import { app } from "./app.js";
// Import dotenv to load environment variables from a .env file
import dotenv from "dotenv";

// Configure dotenv to load environment variables from the .env file
dotenv.config({
	path: "./.env" // Specify the path to the .env file
});

// Define the port for the server to listen on, defaulting to 4000 if not specified
const port = process.env.PORT || 4000;

// Connect to the MongoDB database
connectDB()
	.then(() => {
		// Start the Express server if the database connection is successful
		app.listen(port);
		console.log(`Server running on port ${port}`); // Log the server's running port

		// Set up an error event listener for the server
		app.on("error", err => console.log("Server error: ", err));
	})
	.catch(err => {
		// Log an error message if the database connection fails
		console.log("MongoDB connection failed: " + err);
	});

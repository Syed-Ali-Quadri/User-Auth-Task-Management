// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";
// Import the database name constant
import { DB_NAME } from "../constants.js";

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Step 1: Attempt to connect to MongoDB using the connection URI
        const connectInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}` // Use the MongoDB URI and the database name
        );

        // Step 2: Log a success message upon successful connection
        console.log(`Connected to MongoDB`);
    } catch (error) {
        // Step 3: If there is an error during the connection, log the error
        console.error(error);
        // Step 4: Exit the process with a failure code if the connection fails
        process.exit(1);
    }
};

// Export the connectDB function for use in other modules
export { connectDB }

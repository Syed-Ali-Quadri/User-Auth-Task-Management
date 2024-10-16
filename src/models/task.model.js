// Import mongoose and Schema constructor to define the structure for a MongoDB document
import mongoose, { Schema } from "mongoose";

// Define a schema for the Task model
const taskSchema = new Schema({
    // Task title field, a required string
    title: {
        type: String,
        required: true
    },
    // Task description field, also a required string
    description: {
        type: String,
        required: true
    },
    // Task status field, restricted to specific values (enum), with a default value of "pending"
    status: {
        type: String,
        enum: ["pending", "inProgress", "completed", "backlog"], // Allowed values
        default: "pending" // Default status
    }
}, 
{ 
    // Enable automatic creation of "createdAt" and "updatedAt" timestamps for each task
    timestamps: true 
});

// Export the Task model, which corresponds to the "tasks" collection in MongoDB
export const Task = mongoose.model("Task", taskSchema);

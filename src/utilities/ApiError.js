// Define a custom error class ApiError that extends the built-in Error class
class ApiError extends Error {
	// Constructor to initialize the error object
	constructor(
		statusCode, // HTTP status code for the error
		message = "Something went wrong", // Default error message
		error = [], // Optional additional error details (can be an array of errors)
		stack // Optional stack trace for debugging
	) {
		super(message); // Call the parent class constructor with the error message
		this.statusCode = statusCode; // Assign the HTTP status code to the instance
        this.message = message; // Assign the error message to the instance
		this.error = error; // Assign any additional error details to the instance
		this.success = false; // Indicate that this is an unsuccessful operation
        this.data = null; // Initialize data property to null (can be used to store response data)

		if (stack) {
			this.stack = stack; // If a stack trace is provided, assign it to the instance
		} else {
			// Capture the stack trace specific to this error instance if no stack is provided
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

// Export the ApiError class for use in other modules
export { ApiError };

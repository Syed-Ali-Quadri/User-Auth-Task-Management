// Define a class ApiResponse for formatting API responses
class ApiResponse {
    // Constructor to initialize the response object
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // Assign the HTTP status code to the instance
        this.data = data; // Assign the response data to the instance
        this.message = message; // Assign a message, defaulting to "Success"
        this.success = statusCode < 400; // Determine success based on status code (success if < 400)
    }
}

// Export the ApiResponse class for use in other modules
export { ApiResponse };

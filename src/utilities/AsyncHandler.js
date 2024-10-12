// Define a higher-order function AsyncHandler to wrap asynchronous route handlers
const AsyncHandler = requestHandler => {
    // Return a new function that takes the request, response, and next middleware function
	return (req, res, next) => {
        // Use Promise.resolve to ensure that the requestHandler is treated as a promise
		Promise.resolve(requestHandler(req, res, next))
            // If the promise is rejected, pass the error to the next middleware
			.catch(err => {
				next(err); // Call the next middleware with the error
			});
	};
};

// Export the AsyncHandler function for use in other modules
export { AsyncHandler };

import { AsyncHandler } from "../utilities/AsyncHandler.js"
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { User } from "../models/user.model.js"

const registerUser = AsyncHandler(async (req, res) => {
    const {username, fullName, email, password} = req.body;

    // Validate input
    if (!username ||!fullName ||!email ||!password) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUsername = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUsername) {
        throw new ApiError(400, "Username or email already exists")
    }

    const user = await User.create({
        username,
        fullName,
        email: email.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) throw new ApiError(401, "Something went wrong")

    return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Successfully created user."))
})

const loginUser = AsyncHandler(async (req, res) => {

})

export { registerUser, loginUser }
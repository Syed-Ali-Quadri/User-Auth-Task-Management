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

const generateAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);

    console.log("Upper User: ", user)
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    return { AccessToken, RefreshToken }
}

const loginUser = AsyncHandler(async (req, res) => {
    const {email, username, password} = req.body;

    if(!email && !username || !password) throw new ApiError(401, "Provide the details in the field");

    const checkUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    console.log("CheckUser: ", checkUser)

    if(!checkUser) throw new ApiError(401, "This user is not exist in the database.")

    const isPasswordMatch = await checkUser.isPasswordCorrect(password);
    if(!isPasswordMatch) throw new ApiError(401, "Password does not match.")

    console.log("Is password correct: ", isPasswordMatch)

    const { AccessToken, RefreshToken } = await generateAccessTokenAndRefreshToken(checkUser._id)
    
    const logginUser = await User.findById(checkUser._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    }

    return res
    .status(200)
    .cookie("refreshToken", RefreshToken, options)
    .cookie("accessToken", AccessToken, options)
    .json(new ApiResponse(200, { user: logginUser, AccessToken, RefreshToken }, "User successfully logged in."));

})

export { registerUser, loginUser }
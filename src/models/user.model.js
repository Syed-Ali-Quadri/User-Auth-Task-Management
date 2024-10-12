import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: [true, "Username must be lowercase"],
			trim: true,
			minlength: [5, "Username must be at least 5 characters long"],
			maxlength: [20, "Username must be at most 20 characters long"],
			index: true
		},
		fullName: {
			type: String,
			required: true,
			maxLength: 30
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: [true, "Email must be lowercase"]
		},
		password: {
			type: String,
			required: true,
			minlength: [8, "Password must be at least 8 characters long"]
		},
		tasks: {
			type: [Schema.Types.ObjectId],
			ref: "Task"
		},
		refreshToken: {
			type: String
		}
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        id: this._id
    }, process.env.REFRESH_TOKEN, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema);

import express from "express"
import cookieParser from "cookie-parser";
import { CONFIG_EXPRESS_LIMIT } from "./constants.js"

const app = express()

// Middleware to parse incoming JSON request bodies with a size limit
app.use(express.json({ limit: CONFIG_EXPRESS_LIMIT }));

// Middleware to parse URL-encoded request bodies with a size limit
app.use(express.urlencoded({ extended: true, limit: CONFIG_EXPRESS_LIMIT }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse cookies attached to incoming requests
app.use(cookieParser());

import userRoute from "./routes/user.routes.js"

app.use("/api/v1/users/", userRoute)

export { app }
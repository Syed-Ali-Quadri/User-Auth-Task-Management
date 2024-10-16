import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utilities/ApiError.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

const createTask = AsyncHandler(async (req, res) => {
	const { title, description } = req.body;

    if(!title || !description) throw new ApiError(401, "Fill the required fields")

    const user = await User.findById(req.user.id)
    console.log("User data", user)

    if(!user) throw new ApiError(401, "Invalid user")

    const createTask = await Task.create({
        title,
        description
    })

    if(!createTask) throw new ApiError(401, "something went wrong creating task")

    const updateUser = await User.findByIdAndUpdate(req.user.id, {
        $push: { tasks: createTask._id }},
        { new: true, useFindAndUpdate: false}
    )

    await updateUser.save()

    console.log("updateUser", updateUser)
    return res
    .status(200)
    .json(new ApiResponse(201, createTask, "Suucessfully created task"))
});

const updateTask = AsyncHandler(async (req, res) => {
    
})

const deleteTask = AsyncHandler(async (req, res) => {

})

const specificTask = AsyncHandler(async (req, res) => {
    const { taskId } = req.params

    if(!taskId) throw new ApiError(401, "Invalid task id")

    const task = await Task.findById(taskId)

    if(!task) throw new ApiError(401, "Task not found")

    return res
    .status(200)
    .json(new ApiResponse(200, task, "Task details fetched successfully."))
})

const userTasks = AsyncHandler(async (req, res) => {
    const userId = req.user.id

    const userTask = await User.findById(userId).populate("tasks")

    // console.log(userTask)

    return res
    .status(200)
    .json(new ApiResponse(200, userTask.tasks, "User's tasks fetched successfully."))
})
export { createTask, updateTask, deleteTask, specificTask, userTasks };

const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");

const canAccessTask = (task, user) =>
  user.role === "admin" || task.owner.toString() === user.userId;

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "todo",
      owner: req.user.userId,
    });

    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { owner: req.user.userId };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ items: tasks });
  } catch (error) {
    return next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    if (!canAccessTask(task, req.user)) {
      return next(new ApiError(403, "Forbidden"));
    }

    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    if (!canAccessTask(task, req.user)) {
      return next(new ApiError(403, "Forbidden"));
    }

    if (req.body.title !== undefined) {
      task.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      task.description = req.body.description;
    }

    if (req.body.status !== undefined) {
      task.status = req.body.status;
    }

    await task.save();

    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    if (!canAccessTask(task, req.user)) {
      return next(new ApiError(403, "Forbidden"));
    }

    await task.deleteOne();

    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
};

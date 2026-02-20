const { body, param } = require("express-validator");

const taskIdParam = [
  param("id").isMongoId().withMessage("Task id must be a valid Mongo id"),
];

const createTaskRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().trim(),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
];

const updateTaskRules = [
  body("title").optional().trim().notEmpty().withMessage("Title is required"),
  body("description").optional().trim(),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
];

module.exports = {
  taskIdParam,
  createTaskRules,
  updateTaskRules,
};

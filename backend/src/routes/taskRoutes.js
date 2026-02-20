const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  taskIdParam,
  createTaskRules,
  updateTaskRules,
} = require("../validators/taskValidators");
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(authenticate);

router.post("/", createTaskRules, validateRequest, createTask);
router.get("/", listTasks);
router.get("/:id", taskIdParam, validateRequest, getTask);
router.patch("/:id", taskIdParam, updateTaskRules, validateRequest, updateTask);
router.delete("/:id", taskIdParam, validateRequest, deleteTask);

module.exports = router;

const express = require("express");

const userController = require("./../controllers/userController");
const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userController;
const authController = require("./../controllers/authController");
const { signUp } = authController;

const router = express.Router();

router.post("/signup", signUp);
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

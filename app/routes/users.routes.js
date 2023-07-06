const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { checkUser, rolesMiddleware } = require("../middleware");

// Get List of Users
router.get("/", usersController.getUsers);

// Get Current user
router.get(
  "/current-user",
  [checkUser.getCurrentUser],
  usersController.getCurrentUser
);

// Get User by ID
// require authentication
router.get(
  "/:id",
  // [ checkUser.getCurrentUser ],
  usersController.getUserById
);

// Get User by Role ID
// require authentication
router.get(
  "/by-role/:id",
  // [ checkUser.getCurrentUser ],
  usersController.getUsersByRole
);

// Update a User by ID
router.put(
  "/:id",
  // [checkUser.getCurrentUser, rolesMiddleware.isModeratorOrAdmin],
  usersController.updateUserById
);

// Delete a User by ID
router.delete(
  "/:id",
  [checkUser.getCurrentUser],
  usersController.deleteUserById
);

module.exports = router;

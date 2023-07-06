const { Op } = require("sequelize");
const Role = require("../models").role;
const User = require("../models").user;

// Get List of Users
const getUsers = async (req, res) => {
  const { email } = req.query;
  let condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
  try {
    const users = await User.findAll({
      where: condition,
      include: { all: true },
    });
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

// Get current user 
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "No user found but why " });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Role });
    if (!user) return res.status(404).json({ message: "No user found [users controller] " });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

// Update a User by ID
const updateUserById = async (req, res) => {
  const roleId = req.body.roleId;

  try {
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });
    const user = await User.findByPk(req.params.id, { include: Role });
    user.update({
      firstname: req.body.firstname || user.firstname,
      lastname: req.body.lastname || user.lastname,
      phonenumber: req.body.phonenumber || user.phonenumber,
      countrycode: req.body.countrycode || user.countrycode,
      email: req.body.email || user.email,
      isActive: req.body.active,
      role: user.setRole(role) || user.role,
      password: req.body.password || user.password,
      passwordConfirmation:
        req.body.passwordConfirmation || user.passwordConfirmation,
    });
    res.status(200).json(user);
    if (!user)
      return res
        .status(404)
        .json({ message: "No user found [user controller]" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

// Get a User by role ID
const getUsersByRole = async (req, res) => {
  //roleId;
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });
  try {
    const user = await User.findAll({
      where: { roleId: role.id },
      include: { all: true },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

// Delete a User by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "No user found [user controller]" });
    user.destroy();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUsersByRole,
  getCurrentUser,
};

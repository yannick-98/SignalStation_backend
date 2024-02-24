const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("../services/jwt");

const user = (req, res) => {
  return res.status(200).json({
    message: "User driver working",
    user: req.user,
  });
};

const register = async (req, res) => {
  try {
    let params = req.body;

    if (!params.name || !params.lastname || !params.email || !params.password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    const find = await User.findOne({ email: params.email });

    if (find) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    const user = new User(params);
    await user.save();

    return res.status(200).json({
      message: "User created",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    let params = req.body;

    if (!params.email || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }

    const user = await User.findOne({ email: params.email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!bcrypt.compareSync(params.password, user.password)) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.createToken(user);

    user.password = undefined;

    return res.status(200).json({
      message: "User logged",
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        plan: user.plan,
      },
      token,
    });
  } catch (error) {}
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        created_at: user.created_at,
        plan: user.plan,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let params = req.body;

    if (!params.name && !params.lastname && !params.email && !params.password) {
      return res.status(400).json({
        message: "Missing params",
      });
    }

    if (params.password) {
      const pwd = bcrypt.hashSync(params.password, 10);
      params.password = pwd;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        name: params.name,
        lastname: params.lastname,
        email: params.email,
        password: params.password,
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated",
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        plan: user.plan,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

module.exports = {
  user,
  register,
  login,
  getUser,
  updateUser,
};

import User from "../modal/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blacklist from "../modal/blacklist.js";

export const getUser = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Please provide valid fields." });
  }
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
    return res.status(400).json({ message: "Please provide valid fields." });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
    res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credentials are invalid." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credentials are invalid." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, message: "User login successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const changePassword = async (req, res) => {
  const { email, password } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary fields." });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.email !== email) {
      return res.status(401).json({ message: "Unauthorized request." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: "Please provide token" });
  }

  try {
    const newBlacklist = new Blacklist({
      token,
    });
    await newBlacklist.save();

    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

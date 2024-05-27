import jwt from "jsonwebtoken";
import Blacklist from "../modal/blacklist.js";

export const auth = async (req, res, next) => {
  const token = await req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const checkIfBlacklisted = await Blacklist.findOne({ token });

    if (checkIfBlacklisted) {
      return res
        .status(401)
        .json({ message: "This session has expired. Please login" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

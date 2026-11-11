import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes using JWT
export const authUser = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    // Verify JWT token
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from database
    const user = await User.findById(decodedUser.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

// Host-only access
export const hostOnly = (req, res, next) => {
  if (req.user && req.user.role === "host") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Host only.",
  });
};

// Guest-only access
export const guestOnly = (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Guest only.",
  });
};

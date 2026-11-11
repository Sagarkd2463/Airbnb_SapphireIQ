import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/Password.js";
import generateToken from "../utils/token.js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register a new user
export const registerUserService = async (userData) => {
  const { name, email, password, phone, profileImage, role } = userData;

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !password) {
    throw Error("Name, email and password are required");
  }

  // Validate password length
  if (password.length < 10) {
    throw Error("Password must contain at least 10 characters");
  }

  // Validate email
  const normalizedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) {
    throw Error("Please enter a valid email address");
  }

  // Validate role
  if (role !== undefined && !["guest", "host"].includes(role)) {
    throw Error("Role must be guest or host");
  }

  // Check existing user
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password, 10);

  try {
    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      profileImage: profileImage || "",
      role: role || "guest",
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      token,
    };
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      throw Error("Email already registered");
    }

    throw error;
  }
};

// Login user
export const loginUserService = async ({ email, password }) => {
  // Validate required fields
  if (!email?.trim() || !password) {
    throw Error("Email and password are required");
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Validate email
  if (!emailRegex.test(normalizedEmail)) {
    throw Error("Please enter a valid email address");
  }

  // Find user and include password
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Remove password from response
  const userData = user.toObject();
  delete userData.password;

  return {
    user: userData,
    token,
  };
};

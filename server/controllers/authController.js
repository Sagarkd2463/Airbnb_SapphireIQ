import {
  registerUserService,
  loginUserService,
} from "../services/authService.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const result = await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

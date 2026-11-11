import User from "../models/User.js";

// Get all users
export const getAllUsersService = async () => {
  return await User.find().sort({ createdAt: -1 });
};

// Get user by ID
export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Get user by email
export const getUserByEmailService = async (email) => {
  return await User.findOne({ email: email.toLowerCase() }).select("+password");
};

// Update user profile
export const updateUserService = async (userId, updateData) => {
  const updateFields = ["name", "phone", "profileImage"];

  const filteredData = {};

  updateFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    returnDocument: "after",
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Delete user
export const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

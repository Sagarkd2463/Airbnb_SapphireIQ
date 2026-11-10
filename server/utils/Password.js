import bcryptjs from "bcryptjs";

export const hashPassword = async (password, salt) => {
  return await bcryptjs.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

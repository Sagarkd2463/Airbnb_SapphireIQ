import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;

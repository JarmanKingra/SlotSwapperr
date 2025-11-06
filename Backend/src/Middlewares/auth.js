import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { JWT_SECRET } = process.env;

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

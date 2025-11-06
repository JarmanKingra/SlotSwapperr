import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/user.js";

dotenv.config();

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: "Missing" });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("SignUp Error: ---- ", err)
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing" });

  try {
    const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "User not Found. Try SignUp" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid Credentials" });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
  });
  } catch (error) {
    console.log("login Error: ---- ", error);
    return res.status(500).json({ message: 'Server error' }); 
  }
};

export { login, signUp };

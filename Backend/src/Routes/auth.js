import express from "express";
const router = express.Router();
import { signUp, login } from "../Controllers/auth.js";


router.route('/signup').post(signUp);
router.route('/login').post(login);

export default router;
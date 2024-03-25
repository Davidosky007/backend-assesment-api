// In your authentication helper
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();
const SECRET = process.env.JWT_SECRET;

export const generateToken = (payload: Record<string, any>) => jwt.sign(payload, SECRET, { expiresIn: "1h" });

export const verifyToken = (token: string) => jwt.verify(token, SECRET) as Record<string, any>;

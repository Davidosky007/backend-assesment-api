import express from "express";
import { getUserByEmail, createUser, updateUserById } from "../model/user";
import { generateToken } from "../helpers";
import bcrypt from 'bcryptjs';

/**
 * Endpoint for user login
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with user data and session token
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await getUserByEmail(email).select("+authentication.password +authentication.salt");
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const token = generateToken({ userId: user._id });
    await updateUserById(user._id.toString(), { authentication: { sessionToken: token } });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * Endpoint for user registration
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with registered user data
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const sessionToken = generateToken({ email });

    const user = await createUser({
      email,
      username,
      authentication: {
        password: hashedPassword,
        salt: salt,
        sessionToken
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

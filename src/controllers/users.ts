import express from "express";
import { getUsers, deleteUserById, getUserById } from "../model/user";

/**
 * Endpoint to get all users
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with all users' data (excluding authentication details)
 */
export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    // Map users to remove authentication field
    const sanitizedUsers = users.map(user => {
      const { authentication, ...sanitizedUser } = user as any;
      return sanitizedUser;
    });

    return res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}



/**
 * Endpoint to delete a user by ID
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response indicating successful deletion
 */
export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(400).json({ message: 'Bad Request - User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.sendStatus(500);
  }
};


/**
 * Endpoint to update a user by ID
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with updated user data
 */
export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    // Basic validation
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Retrieve user
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.username = username;
    user.email = email;

    // Save updated user
    await user.save();

    // Return updated user
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

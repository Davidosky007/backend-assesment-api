import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../model/user";
import { verifyToken } from "../helpers";
import { Request } from 'express';
import { getProductById } from "../model/product";
import { AuthenticatedRequest } from "types/types";

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

     next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const isProductOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const productId = req.params.id;
    const userId = get(req, "identity._id") as string;
    // Convert userId to string
    const convertUserId = userId.toString();

    console.log("convertUserId: ", convertUserId);

    // Retrieve the product from the database
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Convert product userId to string for consistency
    const productUserId = product.userId.toString();
    console.log("productUserId: ", productUserId);

    // Check if the product belongs to the authenticated user
    if (productUserId !== convertUserId) {
      return res.status(403).json({ error: 'You are not authorized to perform this action' });
    }

    // If the user is the owner of the product, proceed to the next middleware
    next();
  } catch (error) {
    console.error('Error in isProductOwner middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




export const isAuthenticated = async (req: AuthenticatedRequest<any>, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.sendStatus(403);
    }

    const decodedToken = verifyToken(token);
    const existingUser = await getUserBySessionToken(decodedToken.sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    req.identity = existingUser;
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};


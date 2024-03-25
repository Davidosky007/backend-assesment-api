import express from "express";
import { getProducts, createProduct, getProductById, updateProductById, deleteProductById } from "../model/product";
import { AuthenticatedRequest } from "../types/types";

/**
 * Endpoint to retrieve all products
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with all products
 */
export const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const products = await getProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(404).send('Products not found');
  }
};


/**
 * Endpoint to create a new product
 * @param req - Express Request object with authenticated user
 * @param res - Express Response object
 * @returns Response with created product data
 */
export const createNewProduct = async (req: AuthenticatedRequest<any>, res: express.Response) => {
  try {
    const { name, quantity, image, price, description } = req.body;
    const userId = req.identity._id;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const product = await createProduct({ name, price, quantity, image, description }, userId);

    if (!product) {
      return res.status(500).json({ message: 'Error creating product' });
    }

    return res.status(201).json(product);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};


/**
 * Endpoint to retrieve a product by ID
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with the requested product data
 */
export const getProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};


/**
 * Endpoint to update a product by ID
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with the updated product data
 */
export const updateProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Get all fields from the request body

    console.log("Update Product Request Body:", req.body); // Log the request body for debugging

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    const updatedProduct = await updateProductById(id, updateFields);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};



/**
 * Endpoint to delete a product by ID
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response indicating successful deletion
 */
export const deleteProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProductById(id);

    if (!deletedProduct) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    return res.status(204).json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



import express from "express";
import {
  getAllProducts,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products"; 
import { isAuthenticated, isProductOwner } from "../middlewares";

export default (router: express.Router) => {
  // Route to get all products
  router.get("/products", isAuthenticated, getAllProducts);
  // Route to get a single product by its ID
  router.get("/products/:id", isAuthenticated, getProduct);
  // Route to create a new product
  router.post("/products", isAuthenticated, createNewProduct);
  // Route to update a product
  router.patch("/products/:id", isAuthenticated, isProductOwner, updateProduct);
  // Route to delete a product
  router.delete("/products/:id", isAuthenticated, isProductOwner, deleteProduct);
};

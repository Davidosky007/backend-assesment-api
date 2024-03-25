import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProductModel, getProducts, getProductById, createProduct, deleteProductById, updateProductById } from '../model/product';

dotenv.config();
// Generate a valid ObjectId for MOCK_USER_ID
const MOCK_USER_ID = new mongoose.Types.ObjectId();

const MOCK_PRODUCT_DATA = {
  name: 'Test Product',
  quantity: 10, // Ensure required fields are present
  price: 19.99,
  description: 'A product for testing purposes',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {});
});

afterEach(async () => {
  await ProductModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

test('getProducts retrieves all products', async () => {
  await createProduct(MOCK_PRODUCT_DATA, MOCK_USER_ID.toString());
  await createProduct({ ...MOCK_PRODUCT_DATA, name: 'Another Product' }, MOCK_USER_ID.toString());

  const products = await getProducts();
  expect(products.length).toBeGreaterThanOrEqual(2);
});

test('getProductById finds a product by ID', async () => {
  const createdProduct = await createProduct(MOCK_PRODUCT_DATA, MOCK_USER_ID.toString());

  const foundProduct = await getProductById(createdProduct._id);
  expect(foundProduct).toEqual(expect.objectContaining(MOCK_PRODUCT_DATA));
});

// Use a valid ObjectID for testing
test('getProductById returns null for non-existent ID', async () => {
  const testProductId = new mongoose.Types.ObjectId().toString(); // Generate a valid ObjectId and convert to string
  const product = await getProductById(testProductId);
  expect(product).toBeNull();
});


test('createProduct creates a new product with userId', async () => {
  const product = await createProduct(MOCK_PRODUCT_DATA, MOCK_USER_ID.toString());

  expect(product.name).toBe(MOCK_PRODUCT_DATA.name);
  expect(product.userId.toString()).toContain(MOCK_USER_ID.toString()); // Check userId using toContain
});

test('createProduct throws error for missing name', async () => {
  expect.assertions(1);
  try {
    await createProduct({ ...MOCK_PRODUCT_DATA, name: undefined }, MOCK_USER_ID.toString());
  } catch (error) {
    expect(error.message).toBe('Failed to create product');
  }
});


test('deleteProductById removes a product by ID', async () => {
  const createdProduct = await createProduct(MOCK_PRODUCT_DATA, MOCK_USER_ID.toString());

  await deleteProductById(createdProduct._id.toString());
  const deletedProduct = await getProductById(createdProduct._id.toString());
  expect(deletedProduct).toBeNull();
});

// Use a valid ObjectId for testing
test('deleteProductById returns null for non-existent ID', async () => {
  const testProductId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
  const result = await deleteProductById(testProductId.toString());
  expect(result).toBeNull();
});

test('updateProductById updates a product by ID', async () => {
  const createdProduct = await createProduct(MOCK_PRODUCT_DATA, MOCK_USER_ID.toString());
  const updateData = { description: 'Updated description' };

  const updatedProduct = await updateProductById(createdProduct._id, updateData);

  expect(updatedProduct.description).toBe(updateData.description);
});



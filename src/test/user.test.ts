import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel, createUser, getUserByEmail, deleteUserById } from '../model/user'; // Replace with your file path

const MOCK_USER_ID = '1234567890abcdef';
const MOCK_EMAIL = 'test@example.com';
const MOCK_PASSWORD = 'secret123';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {});
});



afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

test('createUser creates a new user with a hashed password', async () => {
  const user = await createUser({
    username: 'Test User',
    email: MOCK_EMAIL,
    authentication: { password: MOCK_PASSWORD },
  });

  expect(user).not.toHaveProperty('authentication'); // Password shouldn't be returned
  expect(user.email).toBe(MOCK_EMAIL);

  const createdUser = await UserModel.findById(user._id);
  expect(createdUser.authentication.password).not.toEqual(MOCK_PASSWORD); // Should be hashed
});

test('createUser throws error for missing email', async () => {
  expect.assertions(1);
  try {
    await createUser({
      username: 'Test User',
      authentication: { password: MOCK_PASSWORD },
    });
  } catch (error) {
    expect(error.message).toBe('Failed to create user');
  }
});

test('createUser throws error for missing password', async () => {
  expect.assertions(1);
  try {
    await createUser({
      username: 'Test User',
      email: MOCK_EMAIL,
    });
  } catch (error) {
    expect(error.message).toBe('Failed to create user');
  }
});
test('getUserByEmail finds a user by email', async () => {
  await createUser({ username: 'Test User', email: MOCK_EMAIL, authentication: { password: MOCK_PASSWORD } });
  const user = await getUserByEmail(MOCK_EMAIL);

  expect(user.email).toBe(MOCK_EMAIL);
});

test('getUserByEmail returns null for non-existent email', async () => {
  const user = await getUserByEmail('non-existent@example.com');
  expect(user).toBeNull();
});

test('deleteUserById removes a user by ID', async () => {
  const user = await createUser({ username: 'Test User', email: MOCK_EMAIL, authentication: { password: MOCK_PASSWORD } });
  await deleteUserById(user._id);

  const deletedUser = await UserModel.findById(user._id);
  expect(deletedUser).toBeNull();
});

test('deleteUserById throws error for non-existent ID', async () => {
  expect.assertions(1);
  try {
    await deleteUserById(MOCK_USER_ID);
  } catch (error) {
    expect(error.message).toMatch(/Cast to ObjectId failed for value/); // Mongoose throws specific error
  }
});

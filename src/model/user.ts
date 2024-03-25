import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface User extends Document {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken?: string;
  };
  authenticate(password: string): boolean;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    sessionToken: { type: String }
  }
});

// Hash password before saving user
userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('authentication.password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.authentication.password = await bcrypt.hash(this.authentication.password, salt);
    this.authentication.salt = salt;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to authenticate user
userSchema.methods.authenticate = function (password: string): boolean {
  if (!this.authentication || !this.authentication.password || !this.authentication.salt) {
    console.error('Missing authentication data');
    return false;
  }

  try {
    const storedPassword = this.authentication.password.trim();
    const isAuthenticated = bcrypt.compareSync(password, storedPassword);
    return isAuthenticated;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

// Index definition for frequently queried fields
userSchema.index({ email: 1 });

export const UserModel = mongoose.model<User>('User', userSchema);

// Retrieve all users
export const getUsers = () => UserModel.find().lean();

// Retrieve user by email
export const getUserByEmail = (email: string) => UserModel.findOne({ email });

// Retrieve user by session token
export const getUserBySessionToken = async (sessionToken: string) => {
  try {
    const user = await UserModel.findOne({ "authentication.sessionToken": sessionToken });
    return user;
  } catch (error) {
    console.error("Error fetching user by session token:", error);
    throw error;
  }
};

// Retrieve user by ID
export const getUserById = (id: string) => UserModel.findById(id);

// Create a new user
export const createUser = async (values: Record<string, any>) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(values.authentication.password, salt);
    values.authentication.salt = salt;
    values.authentication.password = hashedPassword;
    const user = await UserModel.create(values);
    const { authentication: { password }, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

// Delete user by ID
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });

// Update user by ID
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values, { new: true });

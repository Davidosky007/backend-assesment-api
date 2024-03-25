import mongoose, { Schema, Document } from 'mongoose';

interface Product extends Document {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  description?: string;
  userId: string;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a product name"]
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
},
  {
    timestamps: true
  });

// Index definition for frequently queried fields
productSchema.index({ name: 'text', description: 'text' });

export const ProductModel = mongoose.model<Product>('Product', productSchema);

export const getProducts = () => ProductModel.find();
export const getProductById = (id: string) => ProductModel.findById(id);
export const createProduct = async (productData: Record<string, any>, userId: string) => {
  try {
    const dataWithUserId = { ...productData, userId };
    const product = await ProductModel.create(dataWithUserId);
    return product.toObject();
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};
export const deleteProductById = (id: string) => ProductModel.findOneAndDelete({ _id: id });
export const updateProductById = (id: string, productData: Partial<Product>) => ProductModel.findByIdAndUpdate(id, productData, { new: true }); // Partial type for flexibility in updating fields
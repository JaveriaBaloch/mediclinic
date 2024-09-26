import mongoose from 'mongoose';

const { MONGODB_URI} = process.env;
// Update MongoDB client configuration

export const connectDB = async () => {
  if (!MONGODB_URI) throw new Error('NEXT_PUBLIC_MONGODBURL is not defined');

  try {
    // Check if a connection is already established
    if (mongoose.connection.readyState >= 1) {
      return { db: mongoose.connection };
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log('MongoDB connected');
    return { db: mongoose.connection };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
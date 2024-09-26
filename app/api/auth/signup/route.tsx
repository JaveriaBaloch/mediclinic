import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/userModel';
import { s3Upload } from '@/lib/s3'; // Assumes you have a helper function for S3 upload

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); // Use formData for file uploads
    const { username, email, password, role } = Object.fromEntries(data);
    const profileImage = data.get('profileImage') as File; // Get the file

    // Validate input
    if (!username || !email || !password || !profileImage) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Upload profile image to S3
    const imageUrl = await s3Upload(profileImage); // Your S3 upload helper returns URL

    // Create new user
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
      role: role || 'patient',  // Default to 'user' role if not provided
    });

    return NextResponse.json({ message: 'Signup successful', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
  
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    return NextResponse.json({
      message: 'Internal Server Error',
      error: errorMessage,
    }, { status: 500 });
  }
  
}

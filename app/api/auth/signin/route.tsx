import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/userModel';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password } = data;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'defaultSecretKey',
      { expiresIn: '60d' }  // Token expires in 60 days
    );

    // Create a NextResponse object
    const response = NextResponse.json({ message: 'Sign-in successful' }, { status: 200 });

    // Set the JWT token as a cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,   // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Cookie is only sent over HTTPS in production
      maxAge: 60 * 24 * 3600 * 60,  // 60 days
      path: '/',        // Cookie is available throughout the entire website
    });

    return response;
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    }, { status: 500 });
  }
}

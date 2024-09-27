import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/userModel';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Environment variables with NEXT_PUBLIC_ prefix
const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
});

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData(); // Use formData for file uploads
        const { username, email, password, role } = Object.fromEntries(data);
        const profileImage = data.get('profileImage') as File;

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
        const arrayBuffer = await profileImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const timestamp = Date.now(); // Save timestamp for consistent key usage

        const s3Key = `${timestamp}_${profileImage.name}`;

        await s3.send(new PutObjectCommand({
            Bucket,
            Key: s3Key,
            Body: buffer,
            ContentType: profileImage.type, // Optionally specify the content type
        }));

        // Generate the image URL after uploading
        const imageUrl = `https://${Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${s3Key}`;

        // Create new user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            profileImage: imageUrl, // Save the correct image URL
            role: role || 'patient', // Default to 'patient' role
        });

        // Exclude the password from the response object
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profileImage: newUser.profileImage,
            role: newUser.role,
        };

        return NextResponse.json({ message: 'Signup successful', user: userResponse }, { status: 201 });
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

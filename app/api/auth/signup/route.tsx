import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/userModel';
import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.S3_BUCKET;
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

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
        const arrayBuffer = await profileImage.arrayBuffer(); // Read the file as an ArrayBuffer
        const buffer = Buffer.from(arrayBuffer); // Convert to Buffer

        // Use the PutObjectCommand correctly
        await s3.send(new PutObjectCommand({
            Bucket,
            Key: profileImage.name,
            Body: buffer, // Correctly set the Body to buffer
        }));

        // Assuming s3Upload is a function that generates the image URL after uploading
        const imageUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${profileImage.name}`;

        // Create new user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            profileImage: imageUrl,
            role: role || 'patient', // Default to 'patient' role if not provided
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

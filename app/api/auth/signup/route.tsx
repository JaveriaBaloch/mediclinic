import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/userModel';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Server-side environment variables (avoid NEXT_PUBLIC for secrets)
const Bucket = process.env.S3_BUCKET1 || process.env.NEXT_PUBLIC_S3_BUCKET1;
const AWS_REGION1 = process.env.AWS_REGION1 || process.env.NEXT_PUBLIC_AWS_REGION1;
const AWS_ACCESS_KEY_ID1 = process.env.AWS_ACCESS_KEY_ID1 || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID1;
const AWS_SECRET_ACCESS_KEY1 = process.env.AWS_SECRET_ACCESS_KEY1 || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY1;

const s3 = new S3Client({
    region: AWS_REGION1,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID1 as string,
        secretAccessKey: AWS_SECRET_ACCESS_KEY1 as string,
    },
});

export async function POST(req: NextRequest) {
    try {
        if (!Bucket || !AWS_REGION1 || !AWS_ACCESS_KEY_ID1 || !AWS_SECRET_ACCESS_KEY1) {
            return NextResponse.json(
                { message: 'Missing S3 configuration on server' },
                { status: 500 }
            );
        }

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
        const imageUrl = `https://${Bucket}.s3.${AWS_REGION1}.amazonaws.com/${s3Key}`;

        // Create new user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            profileImage: imageUrl, // Save the correct image URL
            role: role, // Default to 'patient' role
            isDoctor:false
        });

        // Exclude the password from the response object
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profileImage: newUser.profileImage,
            role: newUser.role,
            isDoctor:newUser.isDoctor
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

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/model/doctorModal';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS S3 configuration
const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
});

// Function to upload a file to S3
const uploadFileToS3 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const s3Key = `${timestamp}_${file.name}`; // Prefix with timestamp to ensure uniqueness

    await s3.send(new PutObjectCommand({
        Bucket,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
    }));

    // Return the URL of the uploaded file
    return `https://${Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${s3Key}`;
};

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const { doctorId, name, specialty, phone, email } = Object.fromEntries(data);
        const profileImage = data.get('profileImage') as File | null;
        const documents = data.getAll('files') as File[];

        // Validate required fields
        if (!doctorId || !name || !specialty || !phone || !email) {
            console.error('Validation failed:', { doctorId, name, specialty, phone, email });
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Upload profile image if provided
        let profileImageUrl: string | null = null;
        if (profileImage) {
            profileImageUrl = await uploadFileToS3(profileImage);
            console.log('Profile Image URL:', profileImageUrl);
        }

        // Upload documents
        const documentUrls = await Promise.all(
            documents.map(doc => uploadFileToS3(doc))
        );

        // Prepare doctor data for insertion
        const doctorData = {
            doctorId,
            name,
            specialty,
            phone,
            email,
            profileImage: profileImageUrl, // Use the uploaded profile image URL
            documents: documentUrls,
        };

        // Create or update the doctor profile in the database
        const existingDoctor = await Doctor.findOneAndUpdate(
            { doctorId },  // Match the doctor by doctorId
            { $set: doctorData },  // Use $set to update specific fields
            { new: true, upsert: true }  // Return the updated document and create if not found
        );

        return NextResponse.json({ message: 'Profile saved successfully!', doctor: existingDoctor }, { status: 200 });
    } catch (error) {
        console.error('Error during doctor profile save:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
    }
}

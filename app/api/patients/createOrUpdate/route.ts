import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/model/patientModel'; 
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
    const s3Key = `${timestamp}_${file.name}`;

    await s3.send(new PutObjectCommand({
        Bucket,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
    }));

    return `https://${Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${s3Key}`;
};

export async function POST(req: NextRequest) {
    try {
        await connectDB(); // Ensure the connection is established

        const data = await req.formData();
        const patientId = data.get('patientId')?.toString() || '';
        const name = data.get('name')?.toString() || '';
        const age = Number(data.get('age')) || 0;
        const gender = data.get('gender')?.toString() || '';
        const dateOfBirth = new Date(data.get('dateOfBirth')?.toString() || '');
        const phone = data.get('phone')?.toString() || '';
        const email = data.get('email')?.toString() || '';
        const address = JSON.parse(data.get('address')?.toString() || '{}');
        const emergencyContact = JSON.parse(data.get('emergencyContact')?.toString() || '{}');
        const insuranceProvider = JSON.parse(data.get('insuranceProvider')?.toString() || '{}');
        const medicalHistory = JSON.parse(data.get('medicalHistory')?.toString() || '[]');
        const profileImage = data.get('profileImage') as File;

        // Validate required fields
        if (!patientId || !name || !age || !gender || !phone || !email) {
            console.error('Validation failed:', { patientId, name, age, gender, phone, email });
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        let profileImageUrl: string | null = null;
        if (profileImage) {
            profileImageUrl = await uploadFileToS3(profileImage);
            console.log('Profile Image URL:', profileImageUrl);
        }

        // Prepare patient data for insertion
const patientData = {
    patientId,
    name,
    age,
    gender,
    dateOfBirth ,
    phone,
    email,
    address, // Ensure address is parsed correctly
    emergencyContact: emergencyContact,
    insuranceProvider: insuranceProvider,
    medicalHistory: medicalHistory,
    profileImage: profileImageUrl, // Ensure this is included
};

// Debugging output to verify patientData
console.log('Patient Data Before DB Save:', patientData);

// Create or update the patient profile in the database
const existingPatient = await Patient.findOneAndUpdate(
    { patientId },  // Match the patient by patientId
    { $set: patientData },  // Use $set to update specific fields
    { new: true, upsert: true }  // Return the updated document and create if not found
);

// Check if the patient was successfully saved
if (!existingPatient) {
    console.error('Failed to save the patient data to the database.');
} else {
    console.log('Successfully saved patient:', existingPatient);
}


        return NextResponse.json({ message: 'Profile saved successfully!', patient: existingPatient }, { status: 200 });
    } catch (error) {
        console.error('Error during patient profile save:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/model/messageModel';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS S3 configuration
const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
});

const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET;

const uploadFileToS3 = async (file: File) => {
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

// Handler for GET requests to retrieve all messages
export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const { senderId, receiverId, message } = Object.fromEntries(data);
        const file = data.get('file') as File | null;

        await connectDB();

        let fileUrl = '';
        let fileType = '';
        if (file) {
            fileUrl = await uploadFileToS3(file);
            fileType = file.type;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: message,
            fileUrl,
            fileType,
        });

        await newMessage.save();

        return NextResponse.json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ message: 'Error sending message', error }, { status: 500 });
    }
}

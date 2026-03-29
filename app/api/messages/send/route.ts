import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/model/messageModel';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.AWS_REGION1,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID1 as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1 as string,
    },
});

const Bucket = process.env.S3_BUCKET1;

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

    return `https://${Bucket}.s3.${process.env.AWS_REGION1}.amazonaws.com/${s3Key}`;
};

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const senderId = data.get('senderId') as string;
        const receiverId = data.get('receiverId') as string;
        const message = data.get('message') as string;
        const file = data.get('file') as File | null;

        await connectDB();

        let fileUrl = '';
        let fileType = '';
        if (file && file.size > 0) {
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
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Error sending message' },
            { status: 500 }
        );
    }
}